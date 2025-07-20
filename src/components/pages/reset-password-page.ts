// src/components/pages/reset-password-page.ts
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Effect, Data, Schema, pipe } from "effect";
import { navigate } from "../../lib/client/router";
import { RpcAuthClient, RpcLogClient } from "../../lib/client/rpc";
import { AuthError } from "../../lib/shared/api";
import { NotionButton } from "../ui/notion-button";
import { NotionInput } from "../ui/notion-input";
import styles from "./LoginPage.module.css";
import type { LocationService } from "../../lib/client/LocationService";
import { SamController } from "../../lib/client/sam-controller";

// --- Model ---
interface Model {
  newPassword: string;
  confirmPassword: string;
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
}

// --- Custom Error Types ---
class InvalidTokenError extends Data.TaggedError("InvalidTokenError") {}
class UnknownResetError extends Data.TaggedError("UnknownResetError")<{
  readonly cause: unknown;
}> {}

// --- Actions ---
type Action =
  | { type: "UPDATE_NEW_PASSWORD"; payload: string }
  | { type: "UPDATE_CONFIRM_PASSWORD"; payload: string }
  | { type: "RESET_START"; payload: { token: string } }
  | { type: "RESET_SUCCESS" }
  | { type: "RESET_ERROR"; payload: string };

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

    if (newPassword.length < 8) {
      return Effect.sync(() =>
        propose({
          type: "RESET_ERROR",
          payload: "Password must be at least 8 characters long.",
        }),
      );
    }

    if (newPassword !== confirmPassword) {
      return Effect.sync(() =>
        propose({ type: "RESET_ERROR", payload: "Passwords do not match." }),
      );
    }

    const resetEffect = Effect.gen(function* () {
      const rpcClient = yield* RpcAuthClient;
      return yield* rpcClient.resetPassword({ token, newPassword }).pipe(
        Effect.catchAll((error) =>
          Schema.decodeUnknown(AuthError)(error).pipe(
            Effect.matchEffect({
              onSuccess: (authError) => {
                const specificError: InvalidTokenError | UnknownResetError =
                  authError._tag === "BadRequest"
                    ? new InvalidTokenError()
                    : new UnknownResetError({ cause: authError });
                return Effect.fail(specificError);
              },
              onFailure: (parseError) =>
                Effect.fail(new UnknownResetError({ cause: parseError })),
            }),
          ),
        ),
      );
    });

    return resetEffect.pipe(
      Effect.matchEffect({
        onSuccess: () => Effect.sync(() => propose({ type: "RESET_SUCCESS" })),
        onFailure: (error) => {
          let message: string;
          switch (error._tag) {
            case "InvalidTokenError":
              message = "This reset link is invalid or has expired.";
              break;
            default:
              message = "An unknown error occurred. Please try again.";
              break;
          }
          return Effect.sync(() =>
            propose({ type: "RESET_ERROR", payload: message }),
          );
        },
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

  private ctrl = new SamController<
    this,
    Model,
    Action,
    never // Errors are handled within handleAction
  >(
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

            ${model.error
              ? html`<div class=${styles.errorText}>${model.error}</div>`
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
