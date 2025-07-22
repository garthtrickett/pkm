// FILE: src/components/pages/reset-password-page.ts
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Effect, Schema, pipe, Either } from "effect";
import { runClientPromise, runClientUnscoped } from "../../lib/client/runtime";
import { navigate } from "../../lib/client/router";
import { RpcAuthClient } from "../../lib/client/rpc";
import { AuthError } from "../../lib/shared/api";
import { NotionButton } from "../ui/notion-button";
import { NotionInput } from "../ui/notion-input";
import styles from "./LoginPage.module.css";
import { SamController } from "../../lib/client/sam-controller";
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
  error: ResetPasswordError | null;
  isLoading: boolean;
  isSuccess: boolean;
}

// --- Actions ---
type Action =
  | { type: "UPDATE_NEW_PASSWORD"; payload: string }
  | { type: "UPDATE_CONFIRM_PASSWORD"; payload: string }
  | { type: "RESET_START" }
  | { type: "RESET_SUCCESS" }
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
      return { ...model, isLoading: false, error: action.payload };
    default:
      return model;
  }
};

@customElement("reset-password-page")
export class ResetPasswordPage extends LitElement {
  @property({ type: String })
  token = "";

  private ctrl = new SamController<this, Model, Action>(
    this,
    {
      newPassword: "",
      confirmPassword: "",
      error: null,
      isLoading: false,
      isSuccess: false,
    },
    update,
  );

  private _handleSubmit = async (e: Event) => {
    e.preventDefault();

    this.ctrl.propose({ type: "RESET_START" });
    await this.updateComplete;

    const { newPassword, confirmPassword } = this.ctrl.model;
    // ✅ FIX: Capture `this` in a local constant before entering the Effect.
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const component = this;

    const resetEffect = Effect.gen(function* () {
      if (newPassword.length < 8) {
        return yield* Effect.fail(new PasswordTooShortError());
      }
      if (newPassword !== confirmPassword) {
        return yield* Effect.fail(new PasswordsDoNotMatchError());
      }
      const rpcClient = yield* RpcAuthClient;
      // Use the captured constant `component` instead of `this`.
      return yield* rpcClient
        .resetPassword({ token: component.token, newPassword })
        .pipe(
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

    const result = await runClientPromise(Effect.either(resetEffect));

    Either.match(result, {
      onLeft: (error) =>
        this.ctrl.propose({ type: "RESET_ERROR", payload: error }),
      onRight: () => {
        this.ctrl.propose({ type: "RESET_SUCCESS" });
        // Handle side-effect
        runClientUnscoped(
          pipe(
            Effect.sleep("2 seconds"),
            Effect.andThen(navigate("/login")),
            Effect.catchAllCause((cause) =>
              Effect.logError("Navigation failed after password reset", cause),
            ),
          ),
        );
      },
    });
  };

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
          <form @submit=${this._handleSubmit}>
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
