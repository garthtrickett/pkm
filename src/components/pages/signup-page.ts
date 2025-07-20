// src/components/pages/signup-page.ts
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Effect, Data, Schema } from "effect";
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

type SignupActionError =
  | PasswordsDoNotMatchError
  | EmailInUseError
  | UnknownSignupError;

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

    const signupEffect: Effect.Effect<
      unknown,
      SignupActionError,
      RpcAuthClient
    > = Effect.gen(function* () {
      if (password !== confirmPassword) {
        return yield* Effect.fail(new PasswordsDoNotMatchError());
      }
      const rpcClient = yield* RpcAuthClient;
      return yield* rpcClient.signup({ email, password }).pipe(
        Effect.catchAll((error) =>
          Schema.decodeUnknown(AuthError)(error).pipe(
            Effect.matchEffect({
              onSuccess: (authError) => {
                const specificError: SignupActionError =
                  authError._tag === "EmailAlreadyExistsError"
                    ? new EmailInUseError()
                    : new UnknownSignupError({ cause: authError });
                return Effect.fail(specificError);
              },
              onFailure: (parseError) =>
                Effect.fail(new UnknownSignupError({ cause: parseError })),
            }),
          ),
        ),
      );
    });

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
        onFailure: (error) => {
          let message: string;
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
          return Effect.sync(() =>
            propose({ type: "SIGNUP_ERROR", payload: message }),
          );
        },
      }),
      Effect.asVoid,
    );
  }
  return Effect.void;
};

// --- Component Definition ---
@customElement("signup-page")
export class SignupPage extends LitElement {
  private ctrl = new SamController<
    this,
    Model,
    Action,
    never // Error type is `never` because `handleAction` catches its own errors
  >(
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

            ${model.error
              ? html`<div class=${styles.errorText}>${model.error}</div>`
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
