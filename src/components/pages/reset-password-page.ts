// src/components/pages/reset-password-page.ts
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Effect, Schema, pipe } from "effect";
import { navigate } from "../../lib/client/router";
import { RpcAuthClient, RpcLogClient } from "../../lib/client/rpc";
import { AuthError } from "../../lib/shared/api";
import { NotionButton } from "../ui/notion-button";
import { NotionInput } from "../ui/notion-input";
import styles from "./LoginPage.module.css";
import type { LocationService } from "../../lib/client/LocationService";
import { SamController } from "../../lib/client/sam-controller";
// ✅ 1. Import the new typed errors
import {
  PasswordTooShortError,
  PasswordsDoNotMatchError,
  InvalidTokenError,
  UnknownAuthError,
  type ResetPasswordError,
} from "../../lib/client/errors";

// --- Model ---
interface Model {
  newPassword: string;
  confirmPassword: string;
  // ✅ 2. Use the typed error union
  error: ResetPasswordError | null;
  isLoading: boolean;
  isSuccess: boolean;
}

// --- Actions ---
type Action =
  | { type: "UPDATE_NEW_PASSWORD"; payload: string }
  | { type: "UPDATE_CONFIRM_PASSWORD"; payload: string }
  | { type: "RESET_START"; payload: { token: string } }
  | { type: "RESET_SUCCESS" }
  // ✅ 3. The error payload is now a typed error object
  | { type: "RESET_ERROR"; payload: ResetPasswordError };

// --- Pure Update Function ---
const update = (model: Model, action: Action): Model => {
  switch (action.type) {
    case "UPDATE_NEW_PASSWORD":
      return { ...model, newPassword: action.payload, error: null };
    case "UPDATE_CONFIRM_PASSWORD":
      return { ...model, confirmPassword: action.payload, error: null };
    case "RESET_START":
      return { ...model, isLoading: true, error: null };
    case "RESET_SUCCESS":
      return { ...model, isLoading: false, isSuccess: true };
    case "RESET_ERROR":
      // ✅ 4. Store the actual error object in the model
      return { ...model, isLoading: false, error: action.payload };
    default:
      return model;
  }
};

// --- Effectful Action Handler ---
const handleAction = (
  action: Action,
  model: Model,
  propose: (a: Action) => void,
): Effect.Effect<
  void,
  never,
  RpcAuthClient | RpcLogClient | LocationService
> => {
  if (action.type === "RESET_START") {
    const { newPassword, confirmPassword } = model;
    const { token } = action.payload;

    // ✅ 5. Define the core logic effect which can fail with our typed errors.
    const resetEffect: Effect.Effect<void, ResetPasswordError, RpcAuthClient> =
      Effect.gen(function* () {
        // Client-side validation first
        if (newPassword.length < 8) {
          return yield* Effect.fail(new PasswordTooShortError());
        }
        if (newPassword !== confirmPassword) {
          return yield* Effect.fail(new PasswordsDoNotMatchError());
        }

        const rpcClient = yield* RpcAuthClient;
        // Map the backend's AuthError to our specific, typed client errors
        return yield* rpcClient.resetPassword({ token, newPassword }).pipe(
          Effect.catchAll((error) =>
            Schema.decodeUnknown(AuthError)(error).pipe(
              Effect.matchEffect({
                onSuccess: (authError) => {
                  const specificError: ResetPasswordError =
                    authError._tag === "BadRequest"
                      ? new InvalidTokenError()
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
    return resetEffect.pipe(
      Effect.matchEffect({
        onSuccess: () => Effect.sync(() => propose({ type: "RESET_SUCCESS" })),
        onFailure: (
          error, // `error` is our typed ResetPasswordError
        ) =>
          Effect.sync(() => propose({ type: "RESET_ERROR", payload: error })),
      }),
    );
  } else if (action.type === "RESET_SUCCESS") {
    return pipe(
      Effect.sleep("2 seconds"),
      Effect.andThen(navigate("/login")),
      Effect.catchAllCause((cause) =>
        Effect.logError("Navigation failed after password reset", cause),
      ),
    );
  }

  return Effect.void;
};

@customElement("reset-password-page")
export class ResetPasswordPage extends LitElement {
  @property({ type: String })
  token = "";

  private ctrl = new SamController<this, Model, Action, never>(
    this,
    {
      newPassword: "",
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

    if (model.isSuccess) {
      return html`
        <div class=${styles.container}>
          <div class=${styles.formWrapper}>
            <h2 class="text-2xl font-bold text-green-600">Success!</h2>
            <p class="mt-4 text-zinc-600">
              Your password has been reset. Redirecting you to the login page...
            </p>
          </div>
        </div>
      `;
    }

    // ✅ 7. Map the typed error from the model to a user-friendly message
    const getErrorMessage = (
      error: ResetPasswordError | null,
    ): string | null => {
      if (!error) return null;
      switch (error._tag) {
        case "PasswordTooShortError":
          return "Password must be at least 8 characters long.";
        case "PasswordsDoNotMatchError":
          return "Passwords do not match.";
        case "InvalidTokenError":
          return "This reset link is invalid or has expired.";
        case "UnknownAuthError":
          return "An unknown error occurred. Please try again.";
      }
    };
    const errorMessage = getErrorMessage(model.error);

    return html`
      <div class=${styles.container}>
        <div class=${styles.formWrapper}>
          <h2 class=${styles.title}>Choose a New Password</h2>
          <form
            @submit=${(e: Event) => {
              e.preventDefault();
              this.ctrl.propose({
                type: "RESET_START",
                payload: { token: this.token },
              });
            }}
          >
            <div class="space-y-4">
              ${NotionInput({
                id: "newPassword",
                label: "New Password",
                type: "password",
                value: model.newPassword,
                onInput: (e) =>
                  this.ctrl.propose({
                    type: "UPDATE_NEW_PASSWORD",
                    payload: (e.target as HTMLInputElement).value,
                  }),
                required: true,
              })}
              ${NotionInput({
                id: "confirmPassword",
                label: "Confirm New Password",
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
                children: model.isLoading ? "Saving..." : "Save Password",
                type: "submit",
                loading: model.isLoading,
              })}
            </div>
          </form>
        </div>
      </div>
    `;
  }

  protected override createRenderRoot() {
    return this;
  }
}
