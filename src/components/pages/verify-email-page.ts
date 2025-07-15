// src/components/pages/verify-email-page.ts
import { LitElement, html, type TemplateResult } from "lit";
import { customElement, state, property } from "lit/decorators.js";
import { Effect, Data, Queue, Fiber, Stream, pipe } from "effect";
import { runClientUnscoped } from "../../lib/client/runtime";
import { navigate } from "../../lib/client/router";
import { proposeAuthAction } from "../../lib/client/stores/authStore";
import { RpcAuthClient, RpcAuthClientLive } from "../../lib/client/rpc";
import { AuthError } from "../../lib/shared/api";
import type { User } from "../../lib/shared/schemas";
import styles from "./LoginPage.module.css";
import { RpcLogClient } from "../../lib/client/clientLog";
import type { LocationService } from "../../lib/client/LocationService";

// --- Model ---
interface Model {
  status: "verifying" | "success" | "error";
  message: string | null;
}

// --- Custom Error Types ---
class InvalidTokenError extends Data.TaggedError("InvalidTokenError") {}
class UnknownVerificationError extends Data.TaggedError(
  "UnknownVerificationError",
)<{
  readonly cause: unknown;
}> {}

// --- Actions ---
type Action =
  | { type: "VERIFY_START" }
  | { type: "VERIFY_SUCCESS"; payload: { user: User; sessionId: string } }
  | { type: "VERIFY_ERROR"; payload: string };

// --- Pure Update Function ---
const update = (action: Action): Model => {
  switch (action.type) {
    case "VERIFY_START":
      return { status: "verifying", message: "Verifying your email..." };
    case "VERIFY_SUCCESS":
      return {
        status: "success",
        message: "Email verified successfully! Redirecting...",
      };
    case "VERIFY_ERROR":
      return { status: "error", message: action.payload };
  }
};

@customElement("verify-email-page")
export class VerifyEmailPage extends LitElement {
  @property({ type: String })
  token = "";

  @state()
  private model: Model = {
    status: "verifying",
    message: "Verifying your email...",
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
    RpcAuthClient | LocationService | RpcLogClient
  > => {
    this.model = update(action);

    if (action.type === "VERIFY_START") {
      const token = this.token;
      const verifyEffect = Effect.gen(function* () {
        const rpcClient = yield* RpcAuthClient;
        return yield* rpcClient.verifyEmail({ token }).pipe(
          Effect.mapError((error) => {
            if (error instanceof AuthError && error._tag === "BadRequest") {
              return new InvalidTokenError();
            }
            return new UnknownVerificationError({ cause: error });
          }),
        );
      });

      return verifyEffect.pipe(
        Effect.matchEffect({
          onSuccess: (result) =>
            this._propose({ type: "VERIFY_SUCCESS", payload: result }),
          onFailure: (error) => {
            let message: string;
            switch (error._tag) {
              case "InvalidTokenError":
                message = "This verification link is invalid or has expired.";
                break;
              default:
                message = "An unknown error occurred during verification.";
                break;
            }
            return this._propose({ type: "VERIFY_ERROR", payload: message });
          },
        }),
        Effect.asVoid,
      );
    } else if (action.type === "VERIFY_SUCCESS") {
      const { user, sessionId } = action.payload;
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      document.cookie = `session_id=${sessionId}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      proposeAuthAction({ type: "SET_AUTHENTICATED", payload: user });

      // ✅ CORRECTED FIX: Use Effect.catchAllCause with Effect.logError,
      // which has a `never` error channel, to satisfy the function signature.
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

  private readonly _run = Stream.fromQueue(this._actionQueue).pipe(
    Stream.runForEach(this._handleAction),
    Effect.provide(RpcAuthClientLive),
  );

  override connectedCallback() {
    super.connectedCallback();
    this._mainFiber = runClientUnscoped(this._run);
    this._propose({ type: "VERIFY_START" });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._mainFiber) {
      runClientUnscoped(Fiber.interrupt(this._mainFiber));
    }
  }

  override render(): TemplateResult {
    const renderContent = () => {
      switch (this.model.status) {
        case "verifying":
          return html`<div
              class="h-12 w-12 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-600"
            ></div>
            <p class="mt-4 text-zinc-600">${this.model.message}</p>`;
        case "success":
          return html`<h2 class="text-2xl font-bold text-green-600">
              Success!
            </h2>
            <p class="mt-4 text-zinc-600">${this.model.message}</p>`;
        case "error":
          return html`<h2 class="text-2xl font-bold text-red-600">Error</h2>
            <p class="mt-4 text-zinc-600">${this.model.message}</p>
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
