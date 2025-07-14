// src/lib/client/stores/authStore.ts
import { signal } from "@preact/signals-core";
import { Data, Effect, Layer, Queue, Stream } from "effect";
import type { User } from "../../../types/generated/public/User";
import { runClientUnscoped } from "../runtime";
import { AuthError } from "../../shared/api";
import { clientLog } from "../clientLog";
import { ClientLive } from "../runtime";
// ✅ Import the RPC client from its new location
import { RpcAuthClient, RpcAuthClientLive, RpcLogClient } from "../rpc";

// --- RPC Client Service Definition (REMOVED FROM HERE) ---

// --- Model & State ---
export interface AuthModel {
  readonly status:
    | "initializing"
    | "unauthenticated"
    | "authenticating"
    | "authenticated";
  readonly user: User | null;
}

export const authState = signal<AuthModel>({
  status: "initializing",
  user: null,
});

// --- Errors ---
class AuthCheckError extends Data.TaggedError("AuthCheckError")<{
  cause: unknown;
}> {}

// --- Actions ---
type AuthAction =
  | { type: "AUTH_CHECK_START" }
  | { type: "AUTH_CHECK_SUCCESS"; payload: User }
  | { type: "AUTH_CHECK_FAILURE"; payload: AuthError | AuthCheckError }
  | { type: "LOGOUT_START" }
  | { type: "LOGOUT_SUCCESS" }
  | { type: "SET_AUTHENTICATED"; payload: User };

const _actionQueue = Effect.runSync(Queue.unbounded<AuthAction>());

export const proposeAuthAction = (action: AuthAction): void => {
  // ✅ MODIFIED: Add synchronous console log for immediate feedback
  console.log(`[authStore] Proposing action: ${action.type}`, action);
  runClientUnscoped(
    clientLog("info", `[authStore] Proposing action: ${action.type}`),
  );
  runClientUnscoped(Queue.offer(_actionQueue, action));
};

// --- Update Logic ---
const update = (model: AuthModel, action: AuthAction): AuthModel => {
  switch (action.type) {
    case "AUTH_CHECK_START":
      return { status: "authenticating", user: model.user };
    case "AUTH_CHECK_SUCCESS":
      return { status: "authenticated", user: action.payload };
    case "AUTH_CHECK_FAILURE":
      return { status: "unauthenticated", user: null };
    case "LOGOUT_START":
      return { status: "authenticating", user: model.user };
    case "LOGOUT_SUCCESS":
      return { status: "unauthenticated", user: null };
    case "SET_AUTHENTICATED":
      return { status: "authenticated", user: action.payload };
    default:
      return model;
  }
};

// --- Action Handler ---
const handleAuthAction = (
  action: AuthAction,
): Effect.Effect<void, Error, RpcAuthClient | RpcLogClient> =>
  Effect.gen(function* () {
    const oldStatus = authState.value.status;
    authState.value = update(authState.value, action);
    yield* clientLog(
      "info",
      `[authStore] State updated: ${oldStatus} -> ${authState.value.status}`,
      { actionType: action.type },
    );

    const authClient = yield* RpcAuthClient;

    switch (action.type) {
      case "AUTH_CHECK_START": {
        yield* clientLog(
          "info",
          "[authStore] Awaiting RPC call: authClient.me()",
        );

        const result = yield* Effect.either(authClient.me());

        if (result._tag === "Right") {
          yield* clientLog(
            "info",
            "[authStore] RPC 'me' succeeded. Proposing AUTH_CHECK_SUCCESS.",
          );
          proposeAuthAction({
            type: "AUTH_CHECK_SUCCESS",
            payload: result.right,
          });
        } else {
          yield* clientLog(
            "warn",
            "[authStore] RPC 'me' failed. Proposing AUTH_CHECK_FAILURE.",
            { error: result.left },
          );
          proposeAuthAction({
            type: "AUTH_CHECK_FAILURE",
            payload: result.left,
          });
        }
        break;
      }

      case "LOGOUT_START": {
        yield* clientLog(
          "info",
          "[authStore] Awaiting RPC call: authClient.logout()",
        );
        yield* Effect.either(authClient.logout());
        proposeAuthAction({ type: "LOGOUT_SUCCESS" });
        break;
      }
      // ✅ ADDED: Log when SET_AUTHENTICATED is handled
      case "SET_AUTHENTICATED": {
        yield* clientLog(
          "info",
          "[authStore] Successfully set user as authenticated.",
          { userId: action.payload.id },
        );
        break;
      }
    }
  });

// --- Main Loop ---
const RpcClientsLive = Layer.merge(RpcAuthClientLive, RpcLogClient.Default);

const authProcess = Stream.fromQueue(_actionQueue).pipe(
  Stream.runForEach((action) =>
    handleAuthAction(action).pipe(
      Effect.provide(RpcClientsLive),
      Effect.catchAll((err) =>
        clientLog(
          "error",
          `[authStore] Unhandled error in action handler for "${action.type}"`,
          err,
        ),
      ),
    ),
  ),
);

runClientUnscoped(
  clientLog("info", "[authStore] Starting main auth processing stream..."),
);
runClientUnscoped(authProcess.pipe(Effect.provide(ClientLive)));

// Initial action to kick things off
proposeAuthAction({ type: "AUTH_CHECK_START" });
