// src/components/pages/verify-email-page.ts
import { LitElement, html, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Effect, pipe, Schema } from "effect";
import { runClientUnscoped } from "../../lib/client/runtime";
import { navigate } from "../../lib/client/router";
import { proposeAuthAction } from "../../lib/client/stores/authStore";
import { RpcAuthClient, RpcLogClient } from "../../lib/client/rpc";
import { AuthError } from "../../lib/shared/api";
import type { PublicUser } from "../../lib/shared/schemas";
import styles from "./LoginPage.module.css";
import type { LocationService } from "../../lib/client/LocationService";
import { SamController } from "../../lib/client/sam-controller";
// ✅ 1. Import the new typed errors
import {
  InvalidTokenError,
  UnknownAuthError,
  type VerifyEmailError,
} from "../../lib/client/errors";

// --- Model ---
interface Model {
  status: "verifying" | "success" | "error";
  // ✅ 2. Use the typed error union
  error: VerifyEmailError | null;
}

// --- Actions ---
type Action =
  | { type: "VERIFY_START"; payload: { token: string } }
  | {
      type: "VERIFY_SUCCESS";
      payload: { user: PublicUser; sessionId: string };
    }
  // ✅ 3. The error payload is now a typed error object
  | { type: "VERIFY_ERROR"; payload: VerifyEmailError };

// --- Pure Update Function ---
const update = (model: Model, action: Action): Model => {
  switch (action.type) {
    case "VERIFY_START":
      return {
        ...model,
        status: "verifying",
        error: null,
      };
    case "VERIFY_SUCCESS":
      return {
        ...model,
        status: "success",
        error: null,
      };
    case "VERIFY_ERROR":
      // ✅ 4. Store the actual error object in the model
      return { ...model, status: "error", error: action.payload };
    default:
      return model;
  }
};

// --- Effectful Action Handler ---
const handleAction = (
  action: Action,
  _model: Model,
  propose: (a: Action) => void,
): Effect.Effect<
  void,
  never,
  RpcAuthClient | LocationService | RpcLogClient
> => {
  if (action.type === "VERIFY_START") {
    const { token } = action.payload;

    // ✅ 5. Define the core logic effect which can fail with our typed errors.
    const verifyEffect = Effect.gen(function* () {
      const rpcClient = yield* RpcAuthClient;
      return yield* rpcClient.verifyEmail({ token }).pipe(
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
    });

    // ✅ 6. Execute the logic and map success/failure to state-updating actions.
    return verifyEffect.pipe(
      Effect.matchEffect({
        onSuccess: (result) =>
          Effect.sync(() =>
            propose({ type: "VERIFY_SUCCESS", payload: result }),
          ),
        onFailure: (
          error, // `error` is our typed VerifyEmailError
        ) =>
          Effect.sync(() => propose({ type: "VERIFY_ERROR", payload: error })),
      }),
    );
  } else if (action.type === "VERIFY_SUCCESS") {
    const { user, sessionId } = action.payload;
    const expires = new Date();
    expires.setDate(expires.getDate() + 30);
    document.cookie = `session_id=${sessionId}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
    proposeAuthAction({ type: "SET_AUTHENTICATED", payload: user });

    return pipe(
      Effect.sleep("2 seconds"),
      Effect.andThen(navigate("/")),
      Effect.catchAllCause((cause) =>
        Effect.logError("Navigation failed after email verification", cause),
      ),
    );
  }
  return Effect.void;
};

@customElement("verify-email-page")
export class VerifyEmailPage extends LitElement {
  @property({ type: String })
  token = "";

  private ctrl = new SamController<this, Model, Action, never>(
    this,
    {
      status: "verifying",
      error: null,
    },
    update,
    handleAction,
  );

  override connectedCallback() {
    super.connectedCallback();
    this.ctrl.propose({ type: "VERIFY_START", payload: { token: this.token } });
  }

  override render(): TemplateResult {
    const model = this.ctrl.model;

    // ✅ 7. Map the typed error from the model to a user-friendly message
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
