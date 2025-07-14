import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Effect, Data, Queue, Fiber, Stream } from "effect";
import { runClientUnscoped } from "../../lib/client/runtime";
import { navigate } from "../../lib/client/router";
import { RpcAuthClient, RpcAuthClientLive } from "../../lib/client/rpc";
// ✅ FIX 1: Import the shared AuthError, not the non-existent RpcError
import { AuthError } from "../../lib/shared/auth";
import { NotionButton } from "../ui/notion-button";
import { NotionInput } from "../ui/notion-input";
import styles from "./LoginPage.module.css"; // Re-using login styles for consistency

// --- Model ---
interface Model {
  email: string;
  password: string;
  confirmPassword: string;
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
}

// --- Custom Error Types ---
class PasswordsDoNotMatchError extends Data.TaggedError(
  "PasswordsDoNotMatchError",
) {}
class EmailInUseError extends Data.TaggedError("EmailInUseError") {}
class UnknownSignupError extends Data.TaggedError("UnknownSignupError")<{
  readonly cause: unknown;
}> {}

// --- Actions ---
type Action =
  | { type: "UPDATE_EMAIL"; payload: string }
  | { type: "UPDATE_PASSWORD"; payload: string }
  | { type: "UPDATE_CONFIRM_PASSWORD"; payload: string }
  | { type: "SIGNUP_START" }
  | { type: "SIGNUP_SUCCESS" }
  | { type: "SIGNUP_ERROR"; payload: string };

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
      return { ...model, isLoading: false, error: action.payload };
  }
};

// --- Component Definition ---
@customElement("signup-page")
export class SignupPage extends LitElement {
  @state()
  private model: Model = {
    email: "",
    password: "",
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
  ): Effect.Effect<void, never, RpcAuthClient> => {
    this.model = update(this.model, action);

    if (action.type === "SIGNUP_START") {
      const { email, password, confirmPassword } = this.model;

      const signupEffect = Effect.gen(function* () {
        if (password !== confirmPassword) {
          return yield* Effect.fail(new PasswordsDoNotMatchError());
        }
        const rpcClient = yield* RpcAuthClient;
        return yield* rpcClient.signup({ email, password }).pipe(
          // ✅ FIX 2: Replicate the error mapping from login-page.ts
          Effect.mapError((error) => {
            if (error instanceof AuthError) {
              switch (error._tag) {
                // This tag comes directly from our backend handler
                case "EmailAlreadyExistsError":
                  return new EmailInUseError();
              }
            }
            // Fallback for any other kind of error
            return new UnknownSignupError({ cause: error });
          }),
        );
      });

      // ✅ FIX 3: Add Effect.asVoid to match the function's return signature
      return signupEffect.pipe(
        Effect.matchEffect({
          onSuccess: () => this._propose({ type: "SIGNUP_SUCCESS" }),
          onFailure: (error) => {
            let message: string;
            // The error here is one of our custom component errors, so this switch is safe
            switch (error._tag) {
              case "PasswordsDoNotMatchError":
                message = "Passwords do not match.";
                break;
              case "EmailInUseError":
                message = "This email address is already in use.";
                break;
              default:
                message = "An unknown error occurred. Please try again.";
                break;
            }
            return this._propose({ type: "SIGNUP_ERROR", payload: message });
          },
        }),
        Effect.asVoid,
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
            <h2 class=${styles.title}>Signup Successful!</h2>
            <p class="text-center">
              Please check your email to verify your account.
            </p>
            <div class="mt-4 text-center">
              <a
                href="/login"
                class=${styles.link}
                @click=${(e: Event) => {
                  e.preventDefault();
                  runClientUnscoped(navigate("/login"));
                }}
              >
                Return to Login
              </a>
            </div>
          </div>
        </div>
      `;
    }

    return html`
      <div class=${styles.container}>
        <div class=${styles.formWrapper}>
          <h2 class=${styles.title}>Create an Account</h2>
          <form
            @submit=${(e: Event) => {
              e.preventDefault();
              this._propose({ type: "SIGNUP_START" });
            }}
          >
            <div class="space-y-4">
              ${NotionInput({
                id: "email",
                label: "Email",
                type: "email",
                value: this.model.email,
                onInput: (e) =>
                  this._propose({
                    type: "UPDATE_EMAIL",
                    payload: (e.target as HTMLInputElement).value,
                  }),
                required: true,
              })}
              ${NotionInput({
                id: "password",
                label: "Password",
                type: "password",
                value: this.model.password,
                onInput: (e) =>
                  this._propose({
                    type: "UPDATE_PASSWORD",
                    payload: (e.target as HTMLInputElement).value,
                  }),
                required: true,
              })}
              ${NotionInput({
                id: "confirmPassword",
                label: "Confirm Password",
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
                children: this.model.isLoading
                  ? "Creating..."
                  : "Create Account",
                type: "submit",
                loading: this.model.isLoading,
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
