// src/components/pages/login-page.ts
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { runClientUnscoped } from "../../lib/client/runtime";
import { Effect, Data, Schema } from "effect";
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

// --- Model ---
interface Model {
  email: string;
  password: string;
  error: string | null;
  isLoading: boolean;
}

// --- Custom Error Types ---
class LoginInvalidCredentialsError extends Data.TaggedError(
  "LoginInvalidCredentialsError",
) {}
class LoginEmailNotVerifiedError extends Data.TaggedError(
  "LoginEmailNotVerifiedError",
) {}
class UnknownLoginError extends Data.TaggedError("UnknownLoginError")<{
  readonly cause: unknown;
}> {}

type LoginActionError =
  | LoginInvalidCredentialsError
  | LoginEmailNotVerifiedError
  | UnknownLoginError;

// --- Actions ---
type Action =
  | { type: "UPDATE_EMAIL"; payload: string }
  | { type: "UPDATE_PASSWORD"; payload: string }
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: PublicUser; sessionId: string } }
  | { type: "LOGIN_ERROR"; payload: string };

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

    const loginEffect: Effect.Effect<
      { user: PublicUser; sessionId: string },
      LoginActionError,
      RpcAuthClient | RpcLogClient
    > = Effect.gen(function* () {
      const rpcClient = yield* RpcAuthClient;
      return yield* rpcClient.login({ email, password }).pipe(
        Effect.catchAll((error) => {
          const logAndDecode = clientLog(
            "debug",
            "[login-page] Raw error received from RPC:",
            { error },
          ).pipe(Effect.andThen(Schema.decodeUnknown(AuthError)(error)));

          return logAndDecode.pipe(
            Effect.matchEffect({
              onSuccess: (authError) => {
                clientLog(
                  "info",
                  "[login-page] Successfully decoded AuthError:",
                  { authError },
                );
                const specificError: LoginActionError =
                  authError._tag === "Unauthorized"
                    ? new LoginInvalidCredentialsError()
                    : authError._tag === "Forbidden"
                      ? new LoginEmailNotVerifiedError()
                      : new UnknownLoginError({ cause: authError });
                return Effect.fail(specificError);
              },
              onFailure: (parseError) => {
                clientLog(
                  "error",
                  "[login-page] Failed to decode error as AuthError:",
                  { parseError },
                );
                return Effect.fail(
                  new UnknownLoginError({ cause: parseError }),
                );
              },
            }),
          );
        }),
      );
    });

    return loginEffect.pipe(
      Effect.matchEffect({
        onSuccess: (result) =>
          Effect.sync(() =>
            propose({ type: "LOGIN_SUCCESS", payload: result }),
          ),
        onFailure: (error) => {
          const message =
            error._tag === "LoginInvalidCredentialsError"
              ? "Incorrect email or password."
              : error._tag === "LoginEmailNotVerifiedError"
                ? "Please verify your email address before logging in."
                : "An unknown error occurred. Please try again.";

          clientLog(
            "info",
            "[login-page] Mapping domain error to UI message:",
            { errorTag: error._tag, message },
          );
          return Effect.sync(() =>
            propose({ type: "LOGIN_ERROR", payload: message }),
          );
        },
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
  private ctrl = new SamController<
    this,
    Model,
    Action,
    never // The error type is `never` because `handleAction` catches all its specific errors
  >(
    this,
    { email: "", password: "", error: null, isLoading: false },
    update,
    handleAction,
  );

  override render(): TemplateResult {
    const model = this.ctrl.model;
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
            <div class="space-y-4">
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
            </div>

            ${model.error
              ? html`<div class=${styles.errorText}>${model.error}</div>`
              : nothing}

            <div class="mt-6">
              ${NotionButton({
                children: model.isLoading ? "Logging in..." : "Login",
                type: "submit",
                loading: model.isLoading,
              })}
            </div>
          </form>

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
