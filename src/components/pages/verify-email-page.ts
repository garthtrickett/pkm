// FILE: src/components/pages/verify-email-page.ts
import { LitElement, html, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Effect, pipe, Schema, Either } from "effect";
import { runClientPromise, runClientUnscoped } from "../../lib/client/runtime";
import { navigate } from "../../lib/client/router";
import { proposeAuthAction } from "../../lib/client/stores/authStore";
import { RpcAuthClient } from "../../lib/client/rpc";
import { AuthError } from "../../lib/shared/api";
import type { PublicUser } from "../../lib/shared/schemas";
import styles from "./LoginPage.module.css";
import { SamController } from "../../lib/client/sam-controller";
import {
  InvalidTokenError,
  UnknownAuthError,
  type VerifyEmailError,
} from "../../lib/client/errors";

// --- Model ---
interface Model {
  status: "verifying" | "success" | "error";
  error: VerifyEmailError | null;
}

// --- Actions ---
type Action =
  | { type: "VERIFY_START" }
  | {
      type: "VERIFY_SUCCESS";
      payload: { user: PublicUser; token: string };
    }
  | { type: "VERIFY_ERROR"; payload: VerifyEmailError };

// --- Pure Update Function ---
const update = (model: Model, action: Action): Model => {
  switch (action.type) {
    case "VERIFY_START":
      return { ...model, status: "verifying", error: null };
    case "VERIFY_SUCCESS":
      return { ...model, status: "success", error: null };
    case "VERIFY_ERROR":
      return { ...model, status: "error", error: action.payload };
    default:
      return model;
  }
};

@customElement("verify-email-page")
export class VerifyEmailPage extends LitElement {
  @property({ type: String })
  token = "";

  private ctrl = new SamController<this, Model, Action>(
    this,
    { status: "verifying", error: null },
    update,
  );

  override connectedCallback() {
    super.connectedCallback();
    // Use an IIAFE to avoid making connectedCallback async directly
    void (async () => {
      this.ctrl.propose({ type: "VERIFY_START" });
      await this.updateComplete;

      const verifyEffect = RpcAuthClient.pipe(
        Effect.flatMap((rpc) => rpc.verifyEmail({ token: this.token })),
        Effect.catchAll((error) =>
          Schema.decodeUnknown(AuthError)(error).pipe(
            Effect.matchEffect({
              onSuccess: (authError) => {
                const specificError: VerifyEmailError =
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

      const result = await runClientPromise(Effect.either(verifyEffect));

      Either.match(result, {
        onLeft: (error) =>
          this.ctrl.propose({ type: "VERIFY_ERROR", payload: error }),
        onRight: (successPayload) => {
          this.ctrl.propose({
            type: "VERIFY_SUCCESS",
            payload: successPayload,
          });
          const { user, token } = successPayload;
          localStorage.setItem("jwt", token);
          proposeAuthAction({ type: "SET_AUTHENTICATED", payload: user });

          runClientUnscoped(
            pipe(
              Effect.sleep("2 seconds"),
              Effect.andThen(navigate("/")),
              Effect.catchAllCause((cause) =>
                Effect.logError(
                  "Navigation failed after email verification",
                  cause,
                ),
              ), //
            ),
          );
        },
      });
    })();
  }

  override render(): TemplateResult {
    const model = this.ctrl.model;

    const getMessage = (): string => {
      switch (model.status) {
        case "verifying":
          return "Verifying your email...";
        case "success":
          return "Email verified successfully! Redirecting...";
        case "error": {
          if (!model.error) return "An unknown error occurred.";
          switch (model.error._tag) {
            case "InvalidTokenError":
              return "This verification link is invalid or has expired.";
            case "UnknownAuthError":
              return "An unknown error occurred during verification.";
          }
        }
      }
    };
    const message = getMessage();

    const renderContent = () => {
      switch (model.status) {
        case "verifying":
          return html`<div
              class="h-12 w-12 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-600"
            ></div>
            <p class="mt-4 text-zinc-600">${message}</p>`;
        case "success":
          return html`<h2 class="text-2xl font-bold text-green-600">
              Success!
            </h2>
            <p class="mt-4 text-zinc-600">${message}</p>`;
        case "error":
          return html`<h2 class="text-2xl font-bold text-red-600">Error</h2>
            <p class="mt-4 text-zinc-600">${message}</p>
            <div class="mt-6">
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
            </div>`;
      }
    };

    return html`
      <div class=${styles.container}>
        <div
          class="flex w-full max-w-md flex-col items-center rounded-lg bg-white p-8 text-center shadow-md"
        >
          ${renderContent()}
        </div>
      </div>
    `;
  }

  protected override createRenderRoot() {
    return this;
  }
}
