// FILE: src/components/pages/forgot-password-page.ts
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { Effect, Either } from "effect";
import { runClientPromise, runClientUnscoped } from "../../lib/client/runtime";
import { navigate } from "../../lib/client/router";
import { RpcAuthClient } from "../../lib/client/rpc";
import { NotionButton } from "../ui/notion-button";
import { NotionInput } from "../ui/notion-input";
import styles from "./LoginPage.module.css";
import { SamController } from "../../lib/client/sam-controller";
import {
  UnknownAuthError,
  type ForgotPasswordError,
} from "../../lib/client/errors";

// --- Model ---
interface Model {
  email: string;
  error: ForgotPasswordError | null;
  isLoading: boolean;
  isSuccess: boolean;
}

// --- Actions ---
type Action =
  | { type: "UPDATE_EMAIL"; payload: string }
  | { type: "REQUEST_START" }
  | { type: "REQUEST_SUCCESS" }
  | { type: "REQUEST_ERROR"; payload: ForgotPasswordError };

// --- Pure Update Function ---
const update = (model: Model, action: Action): Model => {
  switch (action.type) {
    case "UPDATE_EMAIL":
      return { ...model, email: action.payload, error: null };
    case "REQUEST_START":
      return { ...model, isLoading: true, error: null, isSuccess: false };
    case "REQUEST_SUCCESS":
      return { ...model, isLoading: false, isSuccess: true };
    case "REQUEST_ERROR":
      return { ...model, isLoading: false, error: action.payload };
    default:
      return model;
  }
};

@customElement("forgot-password-page")
export class ForgotPasswordPage extends LitElement {
  private ctrl = new SamController<this, Model, Action>(
    this,
    {
      email: "",
      error: null,
      isLoading: false,
      isSuccess: false,
    },
    update,
  );

  private _handleSubmit = async (e: Event) => {
    e.preventDefault();

    this.ctrl.propose({ type: "REQUEST_START" });
    await this.updateComplete;

    const { email } = this.ctrl.model;

    const requestEffect = RpcAuthClient.pipe(
      Effect.flatMap((rpc) => rpc.requestPasswordReset({ email })),
      Effect.catchAll((cause) => Effect.fail(new UnknownAuthError({ cause }))),
    );

    const result = await runClientPromise(Effect.either(requestEffect));

    Either.match(result, {
      onLeft: (error) =>
        this.ctrl.propose({ type: "REQUEST_ERROR", payload: error }),
      onRight: () => this.ctrl.propose({ type: "REQUEST_SUCCESS" }),
    });
  };

  override render(): TemplateResult {
    const model = this.ctrl.model;

    if (model.isSuccess) {
      return html`
        <div class=${styles.container}>
          <div class=${styles.formWrapper}>
            <h2 class=${styles.title}>Check Your Email</h2>
            <p class="text-center text-zinc-600">
              If an account with that email exists, we've sent a link to reset
              your password.
            </p>
            <div class="mt-6 text-center">
              <a
                href="/login"
                class=${styles.link}
                @click=${(e: Event) => {
                  e.preventDefault();
                  runClientUnscoped(navigate("/login"));
                }}
                >Return to Login</a
              >
            </div>
          </div>
        </div>
      `;
    }

    const errorMessage = model.error
      ? "An unexpected error occurred. Please try again."
      : null;

    return html`
      <div class=${styles.container}>
        <div class=${styles.formWrapper}>
          <h2 class=${styles.title}>Reset Password</h2>
          <p class="mb-4 text-center text-sm text-zinc-600">
            Enter your email address and we will send you a link to reset your
            password.
          </p>
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
            </div>

            ${errorMessage
              ? html`<div class=${styles.errorText}>${errorMessage}</div>`
              : nothing}

            <div class="mt-6">
              ${NotionButton({
                children: model.isLoading ? "Sending..." : "Send Reset Link",
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
              Back to Login
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
