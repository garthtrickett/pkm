// src/components/pages/reset-password-page.ts
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { Effect, Data, Queue, Fiber, Stream, Schema, pipe } from "effect";
import { runClientUnscoped } from "../../lib/client/runtime";
import { navigate } from "../../lib/client/router";
import { RpcAuthClient, RpcAuthClientLive } from "../../lib/client/rpc";
import { AuthError } from "../../lib/shared/api";
import { NotionButton } from "../ui/notion-button";
import { NotionInput } from "../ui/notion-input";
import styles from "./LoginPage.module.css";
import { RpcLogClient } from "../../lib/client/clientLog";
import type { LocationService } from "../../lib/client/LocationService";

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
  | { type: "RESET_START" }
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
  }
};

@customElement("reset-password-page")
export class ResetPasswordPage extends LitElement {
  @property({ type: String })
  token = "";

  @state()
  private model: Model = {
    newPassword: "",
    confirmPassword: "",
    error: null,
    isLoading: false,
    isSuccess: false,
  };

  private readonly _actionQueue = Effect.runSync(Queue.unbounded<Action>());
  private _mainFiber: Fiber.RuntimeFiber<void, unknown> | undefined;

  private _propose = (action: Action) =>
    runClientUnscoped(Queue.offer(this._actionQueue, action));

  private _handleAction = (
    action: Action,
  ): Effect.Effect<
    void,
    never,
    RpcAuthClient | RpcLogClient | LocationService
  > => {
    this.model = update(this.model, action);

    if (action.type === "RESET_START") {
      const { newPassword, confirmPassword } = this.model;

      if (newPassword.length < 8) {
        this._propose({
          type: "RESET_ERROR",
          payload: "Password must be at least 8 characters long.",
        });
        return Effect.void;
      }

      if (newPassword !== confirmPassword) {
        this._propose({
          type: "RESET_ERROR",
          payload: "Passwords do not match.",
        });
        return Effect.void;
      }

      // ✅ FIX: Added `this: ResetPasswordPage` to tell TypeScript the context.
      const resetEffect = Effect.gen(
        function* (this: ResetPasswordPage) {
          const rpcClient = yield* RpcAuthClient;
          return yield* rpcClient
            .resetPassword({ token: this.token, newPassword })
            .pipe(
              Effect.catchAll((error) =>
                Schema.decodeUnknown(AuthError)(error).pipe(
                  Effect.matchEffect({
                    onSuccess: (authError) => {
                      const specificError:
                        | InvalidTokenError
                        | UnknownResetError =
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
        }.bind(this),
      );

      return resetEffect.pipe(
        Effect.matchEffect({
          onSuccess: () => this._propose({ type: "RESET_SUCCESS" }),
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
            return this._propose({ type: "RESET_ERROR", payload: message });
          },
        }),
        Effect.asVoid,
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

  private readonly _run = Stream.fromQueue(this._actionQueue).pipe(
    Stream.runForEach(this._handleAction),
    Effect.provide(RpcAuthClientLive),
  );

  override connectedCallback() {
    super.connectedCallback();
    this._mainFiber = runClientUnscoped(this._run);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._mainFiber) {
      runClientUnscoped(Fiber.interrupt(this._mainFiber));
    }
  }

  override render(): TemplateResult {
    if (this.model.isSuccess) {
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
              this._propose({ type: "RESET_START" });
            }}
          >
            <div class="space-y-4">
              ${NotionInput({
                id: "newPassword",
                label: "New Password",
                type: "password",
                value: this.model.newPassword,
                onInput: (e) =>
                  this._propose({
                    type: "UPDATE_NEW_PASSWORD",
                    payload: (e.target as HTMLInputElement).value,
                  }),
                required: true,
              })}
              ${NotionInput({
                id: "confirmPassword",
                label: "Confirm New Password",
                type: "password",
                value: this.model.confirmPassword,
                onInput: (e) =>
                  this._propose({
                    type: "UPDATE_CONFIRM_PASSWORD",
                    payload: (e.target as HTMLInputElement).value,
                  }),
                required: true,
              })}
            </div>

            ${this.model.error
              ? html`<div class=${styles.errorText}>${this.model.error}</div>`
              : nothing}

            <div class="mt-6">
              ${NotionButton({
                children: this.model.isLoading ? "Saving..." : "Save Password",
                type: "submit",
                loading: this.model.isLoading,
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
