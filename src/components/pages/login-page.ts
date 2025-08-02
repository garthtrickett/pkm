// FILE: src/components/pages/login-page.ts
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { runClientPromise, runClientUnscoped } from "../../lib/client/runtime";
import { Effect, Schema, Either } from "effect";
import { navigate } from "../../lib/client/router";
import { proposeAuthAction } from "../../lib/client/stores/authStore";
import { RpcAuthClient } from "../../lib/client/rpc";
import { AuthError } from "../../lib/shared/api";
import { NotionButton } from "../ui/notion-button";
import { NotionInput } from "../ui/notion-input";
import type { PublicUser } from "../../lib/shared/schemas";
import styles from "./LoginPage.module.css";
import { SamController } from "../../lib/client/sam-controller";
import {
  LoginInvalidCredentialsError,
  LoginEmailNotVerifiedError,
  UnknownAuthError,
  type LoginError,
} from "../../lib/client/errors";

// Model and Action types remain the same...
interface Model {
  email: string;
  password: string;
  error: LoginError | null;
  isLoading: boolean;
}

type Action =
  | { type: "UPDATE_EMAIL"; payload: string }
  | { type: "UPDATE_PASSWORD"; payload: string }
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: PublicUser; token: string } }
  | { type: "LOGIN_ERROR"; payload: LoginError };

const update = (model: Model, action: Action): Model => {
  // ... update function remains the same
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

@customElement("login-page")
export class LoginPage extends LitElement {
  private ctrl = new SamController<this, Model, Action>(
    this,
    { email: "", password: "", error: null, isLoading: false },
    update,
  );

  // The main async orchestration logic lives here
  private _handleSubmit = async (e: Event) => {
    e.preventDefault();

    // 1. Propose the initial state change and wait for the UI to update
    this.ctrl.propose({ type: "LOGIN_START" });
    await this.updateComplete;

    const { email, password } = this.ctrl.model;

    // 2. Define the core async logic as an Effect
    const loginEffect = RpcAuthClient.pipe(
      Effect.flatMap((rpc) => rpc.login({ email, password })),
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

    // 3. Run the effect and get the result
    const result = await runClientPromise(Effect.either(loginEffect));
    // 4. Propose the final state change based on the result
    Either.match(result, {
      onLeft: (error) =>
        this.ctrl.propose({ type: "LOGIN_ERROR", payload: error }),
      onRight: (successPayload) => {
        this.ctrl.propose({ type: "LOGIN_SUCCESS", payload: successPayload });
        // Handle post-success side-effects
        const { user, token } = successPayload;
        localStorage.setItem("jwt", token);
        proposeAuthAction({ type: "SET_AUTHENTICATED", payload: user });
      },
    });
  };

  // The render method remains largely the same
  override render(): TemplateResult {
    const model = this.ctrl.model;
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
          <form @submit=${this._handleSubmit}>
            ${NotionInput({
              id: "email",
              label: "Email", //
              type: "email",
              value: model.email,
              onInput: (e) =>
                this.ctrl.propose({
                  type: "UPDATE_EMAIL",
                  payload: (e.target as HTMLInputElement).value,
                }), //
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
                }), //
              required: true,
            })}
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
