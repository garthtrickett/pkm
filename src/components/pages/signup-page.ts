// src/components/pages/signup-page.ts
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Effect, Schema } from "effect";
import { runClientUnscoped } from "../../lib/client/runtime";
import { navigate } from "../../lib/client/router";
import { RpcAuthClient, RpcLogClient } from "../../lib/client/rpc";
import { AuthError } from "../../lib/shared/auth";
import { NotionButton } from "../ui/notion-button";
import { NotionInput } from "../ui/notion-input";
import styles from "./SignupPage.module.css";
import { SamController } from "../../lib/client/sam-controller";
import { clientLog } from "../../lib/client/clientLog";
import type { LocationService } from "../../lib/client/LocationService";
// ✅ 1. Import the new typed errors
import {
  PasswordsDoNotMatchError,
  EmailInUseError,
  UnknownAuthError,
  type SignupError,
} from "../../lib/client/errors";

// --- Model ---
interface Model {
  email: string;
  password: string;
  confirmPassword: string;
  // ✅ 2. Use the typed error union
  error: SignupError | null;
  isLoading: boolean;
  isSuccess: boolean;
}

// --- Actions ---
type Action =
  | { type: "UPDATE_EMAIL"; payload: string }
  | { type: "UPDATE_PASSWORD"; payload: string }
  | { type: "UPDATE_CONFIRM_PASSWORD"; payload: string }
  | { type: "SIGNUP_START" }
  | { type: "SIGNUP_SUCCESS" }
  // ✅ 3. The error payload is now a typed error object
  | { type: "SIGNUP_ERROR"; payload: SignupError };

// --- Pure Update Function ---
const update = (model: Model, action: Action): Model => {
  switch (action.type) {
    case "UPDATE_EMAIL":
      return { ...model, email: action.payload, error: null };
    case "UPDATE_PASSWORD":
      return { ...model, password: action.payload, error: null };
    case "UPDATE_CONFIRM_PASSWORD":
      return { ...model, confirmPassword: action.payload, error: null };
    case "SIGNUP_START":
      return { ...model, isLoading: true, error: null };
    case "SIGNUP_SUCCESS":
      return { ...model, isLoading: false, isSuccess: true };
    case "SIGNUP_ERROR":
      // ✅ 4. Store the actual error object in the model
      return { ...model, isLoading: false, error: action.payload };
  }
};

// --- Action Handler ---
const handleAction = (
  action: Action,
  model: Model,
  propose: (a: Action) => void,
): Effect.Effect<
  void,
  never,
  RpcAuthClient | RpcLogClient | LocationService
> => {
  if (action.type === "SIGNUP_START") {
    const { email, password, confirmPassword } = model;

    // ✅ 5. Define an effect for the core logic that can FAIL with our typed errors.
    const signupEffect: Effect.Effect<unknown, SignupError, RpcAuthClient> =
      Effect.gen(function* () {
        if (password !== confirmPassword) {
          return yield* Effect.fail(new PasswordsDoNotMatchError());
        }
        const rpcClient = yield* RpcAuthClient;
        // Map the backend's AuthError to our specific, typed client errors
        return yield* rpcClient.signup({ email, password }).pipe(
          Effect.catchAll((error) =>
            Schema.decodeUnknown(AuthError)(error).pipe(
              Effect.matchEffect({
                onSuccess: (authError) => {
                  const specificError: SignupError =
                    authError._tag === "EmailAlreadyExistsError"
                      ? new EmailInUseError()
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

    // ✅ 6. Execute the logic and handle the success/failure at the edge.
    return signupEffect.pipe(
      Effect.matchEffect({
        onSuccess: () =>
          navigate("/check-email").pipe(
            Effect.andThen(
              Effect.sync(() => propose({ type: "SIGNUP_SUCCESS" })),
            ),
            Effect.catchAll((err) =>
              clientLog("error", "Navigation failed after signup", err),
            ),
          ),
        onFailure: (error) =>
          Effect.sync(() => propose({ type: "SIGNUP_ERROR", payload: error })),
      }),
      Effect.asVoid,
    );
  }
  return Effect.void;
};

// --- Component Definition ---
@customElement("signup-page")
export class SignupPage extends LitElement {
  private ctrl = new SamController<this, Model, Action, never>(
    this,
    {
      email: "",
      password: "",
      confirmPassword: "",
      error: null,
      isLoading: false,
      isSuccess: false,
    },
    update,
    handleAction,
  );

  override render(): TemplateResult {
    const model = this.ctrl.model;

    // ✅ 7. Create a helper to map the typed error to a user-friendly string
    const getErrorMessage = (error: SignupError | null): string | null => {
      if (!error) return null;
      switch (error._tag) {
        case "PasswordsDoNotMatchError":
          return "Passwords do not match.";
        case "EmailInUseError":
          return "This email address is already in use.";
        case "UnknownAuthError":
          return "An unknown error occurred. Please try again.";
      }
    };
    const errorMessage = getErrorMessage(model.error);

    return html`
      <div class=${styles.container}>
        <div class=${styles.formWrapper}>
          <h2 class=${styles.title}>Create an Account</h2>
          <form
            @submit=${(e: Event) => {
              e.preventDefault();
              this.ctrl.propose({ type: "SIGNUP_START" });
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
              ${NotionInput({
                id: "confirmPassword",
                label: "Confirm Password",
                type: "password",
                value: model.confirmPassword,
                onInput: (e) =>
                  this.ctrl.propose({
                    type: "UPDATE_CONFIRM_PASSWORD",
                    payload: (e.target as HTMLInputElement).value,
                  }),
                required: true,
              })}
            </div>

            ${errorMessage
              ? html`<div class=${styles.errorText}>${errorMessage}</div>`
              : nothing}

            <div class="mt-6">
              ${NotionButton({
                children: model.isLoading ? "Creating..." : "Create Account",
                type: "submit",
                loading: model.isLoading,
              })}
            </div>
          </form>

          <div class="mt-4 text-center text-sm">
            <a
              href="/login"
              class=${styles.link}
              @click=${(e: Event) => {
                e.preventDefault();
                runClientUnscoped(navigate("/login"));
              }}
            >
              Already have an account? Log in.
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
