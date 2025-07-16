// src/components/pages/login-page.ts
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Effect, Data, Queue, Fiber, Stream, Schema } from "effect";
import { runClientUnscoped } from "../../lib/client/runtime";
import { navigate } from "../../lib/client/router";
import { proposeAuthAction } from "../../lib/client/stores/authStore";
import {
  RpcAuthClient,
  RpcAuthClientLive,
  RpcLogClient,
} from "../../lib/client/rpc";
import { AuthError } from "../../lib/shared/api";
import { NotionButton } from "../ui/notion-button";
import { NotionInput } from "../ui/notion-input";
import type { PublicUser } from "../../lib/shared/schemas";
import styles from "./LoginPage.module.css";
import { clientLog } from "../../lib/client/clientLog";

// --- Model ---
interface Model {
  email: string;
  password: string;
  error: string | null;
  isLoading: boolean;
}

// --- Custom Error Types ---
class LoginInvalidCredentialsError extends Data.TaggedError(
  "LoginInvalidCredentialsError",
) {}
class LoginEmailNotVerifiedError extends Data.TaggedError(
  "LoginEmailNotVerifiedError",
) {}
class UnknownLoginError extends Data.TaggedError("UnknownLoginError")<{
  readonly cause: unknown;
}> {}

// --- Actions (The "Signal" in SAM) ---
type Action =
  | { type: "UPDATE_EMAIL"; payload: string }
  | { type: "UPDATE_PASSWORD"; payload: string }
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: PublicUser; sessionId: string } }
  | { type: "LOGIN_ERROR"; payload: string };

// --- Pure Update Function ---
const update = (model: Model, action: Action): Model => {
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

// --- Component Definition ---
@customElement("login-page")
export class LoginPage extends LitElement {
  @state()
  private model: Model = {
    email: "",
    password: "",
    error: null,
    isLoading: false,
  };

  private readonly _actionQueue = Effect.runSync(Queue.unbounded<Action>());
  private _mainFiber: Fiber.RuntimeFiber<void, unknown> | undefined;

  private _propose = (action: Action) =>
    runClientUnscoped(Queue.offer(this._actionQueue, action));

  private _handleAction = (
    action: Action,
  ): Effect.Effect<void, never, RpcAuthClient | RpcLogClient> => {
    this.model = update(this.model, action);

    if (action.type === "LOGIN_START") {
      const { email, password } = this.model;

      const loginEffect = Effect.gen(function* () {
        const rpcClient = yield* RpcAuthClient;
        return yield* rpcClient.login({ email, password }).pipe(
          Effect.catchAll((error) => {
            // --- EXHAUSTIVE LOGGING ---
            const logAndDecode = clientLog(
              "debug",
              "[login-page] Raw error received from RPC:",
              { error },
            ).pipe(Effect.andThen(Schema.decodeUnknown(AuthError)(error)));

            return logAndDecode.pipe(
              Effect.matchEffect({
                onSuccess: (authError) => {
                  // --- EXHAUSTIVE LOGGING ---
                  clientLog(
                    "info",
                    "[login-page] Successfully decoded AuthError:",
                    { authError },
                  );

                  const specificError:
                    | LoginInvalidCredentialsError
                    | LoginEmailNotVerifiedError
                    | UnknownLoginError =
                    authError._tag === "Unauthorized"
                      ? new LoginInvalidCredentialsError()
                      : authError._tag === "Forbidden"
                        ? new LoginEmailNotVerifiedError()
                        : new UnknownLoginError({ cause: authError });
                  return Effect.fail(specificError);
                },
                onFailure: (parseError) => {
                  // --- EXHAUSTIVE LOGGING ---
                  clientLog(
                    "error",
                    "[login-page] Failed to decode error as AuthError:",
                    { parseError },
                  );
                  return Effect.fail(
                    new UnknownLoginError({ cause: parseError }),
                  );
                },
              }),
            );
          }),
        );
      });

      return loginEffect.pipe(
        Effect.matchEffect({
          onSuccess: (result) =>
            this._propose({ type: "LOGIN_SUCCESS", payload: result }),
          onFailure: (error) => {
            const message =
              error._tag === "LoginInvalidCredentialsError"
                ? "Incorrect email or password."
                : error._tag === "LoginEmailNotVerifiedError"
                  ? "Please verify your email address before logging in."
                  : "An unknown error occurred. Please try again.";

            // --- EXHAUSTIVE LOGGING ---
            clientLog(
              "info",
              "[login-page] Mapping domain error to UI message:",
              { errorTag: error._tag, message },
            );
            return this._propose({ type: "LOGIN_ERROR", payload: message });
          },
        }),
      );
    } else if (action.type === "LOGIN_SUCCESS") {
      const { user, sessionId } = action.payload;
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      document.cookie = `session_id=${sessionId}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
      proposeAuthAction({ type: "SET_AUTHENTICATED", payload: user });
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
    return html`
      <div class=${styles.container}>
        <div class=${styles.formWrapper}>
          <h2 class=${styles.title}>Login</h2>
          <form
            @submit=${(e: Event) => {
              e.preventDefault();
              this._propose({ type: "LOGIN_START" });
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
            </div>

            ${this.model.error
              ? html`<div class=${styles.errorText}>${this.model.error}</div>`
              : nothing}

            <div class="mt-6">
              ${NotionButton({
                children: this.model.isLoading ? "Logging in..." : "Login",
                type: "submit",
                loading: this.model.isLoading,
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
