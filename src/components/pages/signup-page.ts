// FILE: src/components/pages/signup-page.ts
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Effect, Schema, Either } from "effect";
import { runClientPromise, runClientUnscoped } from "../../lib/client/runtime";
import { navigate } from "../../lib/client/router";
import { RpcAuthClient } from "../../lib/client/rpc";
import { AuthError } from "../../lib/shared/auth";
import { NotionButton } from "../ui/notion-button";
import { NotionInput } from "../ui/notion-input";
import styles from "./SignupPage.module.css";
import { SamController } from "../../lib/client/sam-controller";
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
      return { ...model, isLoading: false, error: action.payload };
  }
};

@customElement("signup-page")
export class SignupPage extends LitElement {
  // ✅ FIX: Instantiate the controller with the correct 3 type arguments.
  private ctrl = new SamController<this, Model, Action>(
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
  );

  // The main async orchestration logic lives in the component.
  private _handleSubmit = async (e: Event) => {
    e.preventDefault();

    // Step 1: Propose the starting action and wait for the UI to update.
    this.ctrl.propose({ type: "SIGNUP_START" });
    await this.updateComplete;

    const { email, password, confirmPassword } = this.ctrl.model;

    // Step 2: Define the core asynchronous logic as an Effect.
    const signupEffect = Effect.gen(function* () {
      if (password !== confirmPassword) {
        return yield* Effect.fail(new PasswordsDoNotMatchError());
      }
      const rpcClient = yield* RpcAuthClient;
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

    // Step 3: Run the effect and get the result.
    const result = await runClientPromise(Effect.either(signupEffect));

    // Step 4: Propose the final action based on the result.
    Either.match(result, {
      onLeft: (error) =>
        this.ctrl.propose({ type: "SIGNUP_ERROR", payload: error }),
      onRight: () => {
        this.ctrl.propose({ type: "SIGNUP_SUCCESS" });
        // Handle side-effects like navigation here.
        runClientUnscoped(navigate("/check-email"));
      },
    });
  };

  override render(): TemplateResult {
    const model = this.ctrl.model;

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
          <form @submit=${this._handleSubmit}>
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
