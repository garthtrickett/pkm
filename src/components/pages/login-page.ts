// src/components/pages/login-page.ts
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { runClientUnscoped } from "../../lib/client/runtime";
import { Effect, Schema } from "effect";
import { navigate } from "../../lib/client/router";
import { proposeAuthAction } from "../../lib/client/stores/authStore";
import { RpcAuthClient, RpcLogClient } from "../../lib/client/rpc";
import { AuthError } from "../../lib/shared/api";
import { NotionButton } from "../ui/notion-button";
import { NotionInput } from "../ui/notion-input";
import type { PublicUser } from "../../lib/shared/schemas";
import styles from "./LoginPage.module.css";
import { clientLog } from "../../lib/client/clientLog";
import { SamController } from "../../lib/client/sam-controller";
// ✅ 1. Import our new typed errors
import {
  LoginInvalidCredentialsError,
  LoginEmailNotVerifiedError,
  UnknownAuthError,
  type LoginError,
} from "../../lib/client/errors";

// --- Model ---
interface Model {
  email: string;
  password: string;
  // ✅ 2. The error is now a typed object, not a generic string
  error: LoginError | null;
  isLoading: boolean;
}

// --- Actions ---
type Action =
  | { type: "UPDATE_EMAIL"; payload: string }
  | { type: "UPDATE_PASSWORD"; payload: string }
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: PublicUser; sessionId: string } }
  // ✅ 3. The error payload is now a typed error object
  | { type: "LOGIN_ERROR"; payload: LoginError };

// --- Pure Update Function ---
const update = (model: Model, action: Action): Model => {
  switch (action.type) {
    case "UPDATE_EMAIL":
      return { ...model, email: action.payload, error: null };
    case "UPDATE_PASSWORD":
      return { ...model, password: action.payload, error: null };
    case "LOGIN_START":
      return { ...model, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
      return { ...model, isLoading: false };
    case "LOGIN_ERROR":
      // ✅ 4. Store the actual error object in the model
      return { ...model, isLoading: false, error: action.payload };
  }
};

// --- Action Handler ---
const handleAction = (
  action: Action,
  model: Model,
  propose: (a: Action) => void,
): Effect.Effect<void, never, RpcAuthClient | RpcLogClient> => {
  if (action.type === "LOGIN_START") {
    const { email, password } = model;

    // ✅ 5. Define an effect for the core logic that can FAIL with our typed error.
    const loginEffect: Effect.Effect<
      { user: PublicUser; sessionId: string },
      LoginError, // <-- This is the key change
      RpcAuthClient | RpcLogClient
    > = Effect.gen(function* () {
      const rpcClient = yield* RpcAuthClient;
      // The RPC call can fail. We catch the raw error and map it to our specific, typed UI errors.
      return yield* rpcClient.login({ email, password }).pipe(
        Effect.catchAll((error) =>
          Schema.decodeUnknown(AuthError)(error).pipe(
            Effect.matchEffect({
              onSuccess: (authError) => {
                const specificError: LoginError =
                  authError._tag === "Unauthorized"
                    ? new LoginInvalidCredentialsError()
                    : authError._tag === "Forbidden"
                      ? new LoginEmailNotVerifiedError()
                      : new UnknownAuthError({ cause: authError });
                return Effect.fail(specificError);
              },
              onFailure: (parseError) =>
                Effect.fail(new UnknownAuthError({ cause: parseError })),
            }),
          ),
        ),
      );
    });

    // ✅ 6. Execute the logic effect and handle success or failure at the edge.
    // This separates the "what to do" (loginEffect) from the "how to present it" (matchEffect).
    return loginEffect.pipe(
      Effect.matchEffect({
        onSuccess: (result) =>
          Effect.sync(() =>
            propose({ type: "LOGIN_SUCCESS", payload: result }),
          ),
        onFailure: (error) =>
          clientLog("info", "[login-page] Mapped domain error to UI action:", {
            errorTag: error._tag,
          }).pipe(
            Effect.andThen(
              Effect.sync(() =>
                propose({ type: "LOGIN_ERROR", payload: error }),
              ),
            ),
          ),
      }),
    );
  } else if (action.type === "LOGIN_SUCCESS") {
    const { user, sessionId } = action.payload;
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    document.cookie = `session_id=${sessionId}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
    proposeAuthAction({ type: "SET_AUTHENTICATED", payload: user });
  }

  return Effect.void;
};

@customElement("login-page")
export class LoginPage extends LitElement {
  private ctrl = new SamController<this, Model, Action, never>(
    this,
    { email: "", password: "", error: null, isLoading: false },
    update,
    handleAction,
  );

  override render(): TemplateResult {
    const model = this.ctrl.model;

    // ✅ 7. The render logic can now be smarter if needed, but for now, we map the error to a message.
    const getErrorMessage = (error: LoginError | null): string | null => {
      if (!error) return null;
      switch (error._tag) {
        case "LoginInvalidCredentialsError":
          return "Incorrect email or password.";
        case "LoginEmailNotVerifiedError":
          return "Please verify your email address before logging in.";
        case "UnknownAuthError":
          return "An unknown error occurred. Please try again.";
      }
    };
    const errorMessage = getErrorMessage(model.error);

    return html`
      <div class=${styles.container}>
        <div class=${styles.formWrapper}>
          <h2 class=${styles.title}>Login</h2>
          <form
            @submit=${(e: Event) => {
              e.preventDefault();
              this.ctrl.propose({ type: "LOGIN_START" });
            }}
          >
            <!-- ... form inputs ... -->
            ${NotionInput({
              id: "email",
              label: "Email",
              type: "email",
              value: model.email,
              onInput: (e) =>
                this.ctrl.propose({
                  type: "UPDATE_EMAIL",
                  payload: (e.target as HTMLInputElement).value,
                }),
              required: true,
            })}
            ${NotionInput({
              id: "password",
              label: "Password",
              type: "password",
              value: model.password,
              onInput: (e) =>
                this.ctrl.propose({
                  type: "UPDATE_PASSWORD",
                  payload: (e.target as HTMLInputElement).value,
                }),
              required: true,
            })}
            <!-- ... -->
            ${errorMessage
              ? html`<div class=${styles.errorText}>${errorMessage}</div>`
              : nothing}

            <div class="mt-6">
              ${NotionButton({
                children: model.isLoading ? "Logging in..." : "Login",
                type: "submit",
                loading: model.isLoading,
              })}
            </div>
          </form>

          <!-- ... other links ... -->
          <div class="mt-4 text-center text-sm">
            <a
              href="/forgot-password"
              @click=${(e: Event) => {
                e.preventDefault();
                runClientUnscoped(navigate("/forgot-password"));
              }}
              class=${styles.link}
            >
              Forgot your password?
            </a>
          </div>
          <div class="mt-2 text-center text-sm">
            <a
              href="/signup"
              class=${styles.link}
              @click=${(e: Event) => {
                e.preventDefault();
                runClientUnscoped(navigate("/signup"));
              }}
            >
              Don't have an account? Sign up.
            </a>
          </div>
        </div>
      </div>
    `;
  }
  protected override createRenderRoot() {
    return this;
  }
}
