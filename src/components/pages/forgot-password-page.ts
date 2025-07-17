// src/components/pages/forgot-password-page.ts
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Effect, Data, Queue, Fiber, Stream } from "effect";
import { runClientUnscoped } from "../../lib/client/runtime";
import { navigate } from "../../lib/client/router";
import { RpcAuthClient, RpcAuthClientLive } from "../../lib/client/rpc";
import { NotionButton } from "../ui/notion-button";
import { NotionInput } from "../ui/notion-input";
import styles from "./LoginPage.module.css";
import { clientLog, RpcLogClient } from "../../lib/client/clientLog";

// --- Model ---
interface Model {
  email: string;
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
}

// --- Custom Error Types ---
class UnknownRequestError extends Data.TaggedError("UnknownRequestError")<{
  readonly cause: unknown;
}> {}

// --- Actions ---
type Action =
  | { type: "UPDATE_EMAIL"; payload: string }
  | { type: "REQUEST_START" }
  | { type: "REQUEST_SUCCESS" }
  | { type: "REQUEST_ERROR"; payload: string };

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
  }
};

// --- Component Definition ---
@customElement("forgot-password-page")
export class ForgotPasswordPage extends LitElement {
  @state()
  private model: Model = {
    email: "",
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
  ): Effect.Effect<void, never, RpcAuthClient | RpcLogClient> => {
    this.model = update(this.model, action);

    if (action.type === "REQUEST_START") {
      const { email } = this.model;

      const requestEffect = Effect.gen(function* () {
        const rpcClient = yield* RpcAuthClient;
        return yield* rpcClient
          .requestPasswordReset({ email })
          .pipe(
            Effect.catchAll((error) =>
              Effect.fail(new UnknownRequestError({ cause: error })),
            ),
          );
      });

      return requestEffect.pipe(
        Effect.matchEffect({
          onSuccess: () => this._propose({ type: "REQUEST_SUCCESS" }),
          onFailure: (error) => {
            const message = "An unknown error occurred. Please try again.";
            clientLog("error", "[forgot-password] RPC failed", error);
            return this._propose({ type: "REQUEST_ERROR", payload: message });
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

    return html`
      <div class=${styles.container}>
        <div class=${styles.formWrapper}>
          <h2 class=${styles.title}>Reset Password</h2>
          <p class="mb-4 text-center text-sm text-zinc-600">
            Enter your email address and we will send you a link to reset your
            password.
          </p>
          <form
            @submit=${(e: Event) => {
              e.preventDefault();
              this._propose({ type: "REQUEST_START" });
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
            </div>

            ${this.model.error
              ? html`<div class=${styles.errorText}>${this.model.error}</div>`
              : nothing}

            <div class="mt-6">
              ${NotionButton({
                children: this.model.isLoading
                  ? "Sending..."
                  : "Send Reset Link",
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
