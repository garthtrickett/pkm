// FILE: ./src/lib/client/stores/authStore.ts
import { signal } from "@preact/signals-core";
import { Data, Effect, Layer, Queue, Stream } from "effect";
import type { PublicUser } from "../../shared/schemas";
import {
  runClientUnscoped,
  initializeReplicacheRuntime,
  shutdownReplicacheRuntime,
} from "../runtime";
import { AuthError } from "../../shared/api";
import { clientLog } from "../clientLog";
import { RpcAuthClient, RpcAuthClientLive, RpcLogClient } from "../rpc";
// ✅ 1. Import the ReplicacheService to use it during logout
import { ReplicacheService } from "../replicache";

// --- Model & State ---
export interface AuthModel {
  readonly status:
    | "initializing"
    | "unauthenticated"
    | "authenticating"
    | "authenticated";
  readonly user: PublicUser | null;
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
  | { type: "AUTH_CHECK_SUCCESS"; payload: PublicUser }
  | { type: "AUTH_CHECK_FAILURE"; payload: AuthError | AuthCheckError }
  | { type: "LOGOUT_START" }
  | { type: "LOGOUT_SUCCESS" }
  | { type: "SET_AUTHENTICATED"; payload: PublicUser };

const _actionQueue = Effect.runSync(Queue.unbounded<AuthAction>());

export const proposeAuthAction = (action: AuthAction): void => {
  runClientUnscoped(
    clientLog("info", `[authStore] Proposing action: ${action.type}`),
  );
  runClientUnscoped(Queue.offer(_actionQueue, action));
};

// --- Pure Update Function ---
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

// --- Action Handler (FIXED) ---
const handleAuthAction = (
  action: AuthAction,
): Effect.Effect<
  void,
  Error,
  RpcAuthClient | RpcLogClient | ReplicacheService
> =>
  Effect.gen(function* () {
    const authClient = yield* RpcAuthClient;

    switch (action.type) {
      case "AUTH_CHECK_START": {
        authState.value = update(authState.value, action);
        const result = yield* Effect.either(authClient.me());
        if (result._tag === "Right") {
          proposeAuthAction({
            type: "AUTH_CHECK_SUCCESS",
            payload: result.right,
          });
        } else {
          proposeAuthAction({
            type: "AUTH_CHECK_FAILURE",
            payload: result.left,
          });
        }
        break;
      }

      case "AUTH_CHECK_SUCCESS":
      case "SET_AUTHENTICATED": {
        yield* initializeReplicacheRuntime(action.payload);
        authState.value = update(authState.value, action);
        yield* clientLog(
          "info",
          `[authStore] State is now authenticated and runtime is ready.`,
        );
        break;
      }

      case "AUTH_CHECK_FAILURE": {
        yield* shutdownReplicacheRuntime;
        authState.value = update(authState.value, action);
        break;
      }

      // ✅ THIS IS THE FIX ✅
      case "LOGOUT_START": {
        authState.value = update(authState.value, action);

        // Step 1: Get the Replicache service while the user is still authenticated.
        const replicache = yield* ReplicacheService;
        // Step 2: Purge the local IndexedDB storage BEFORE logging out on the server.
        // This is a promise, so we wrap it in an Effect.
        yield* Effect.promise(() => replicache.client.experimental_delete());
        yield* clientLog(
          "info",
          "[authStore] Replicache IndexedDB purged for logout.",
        );

        // Step 3: Now proceed with the existing server-side logout logic.
        yield* Effect.either(authClient.logout());
        proposeAuthAction({ type: "LOGOUT_SUCCESS" });
        break;
      }

      case "LOGOUT_SUCCESS": {
        document.cookie =
          "session_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        yield* shutdownReplicacheRuntime;
        authState.value = update(authState.value, action);
        break;
      }
    }
  });

// --- Main Loop ---
const RpcClientsLive = Layer.merge(RpcAuthClientLive, RpcLogClient.Default);
const authProcess = Stream.fromQueue(_actionQueue).pipe(
  Stream.runForEach((action) =>
    handleAuthAction(action).pipe(
      // The runtime for this stream will provide the ReplicacheService when available
      Effect.provide(RpcClientsLive),
      Effect.catchAll((err) =>
        clientLog(
          "error",
          `[authStore] Unhandled error for action "${action.type}"`,
          err,
        ),
      ),
    ),
  ),
);

runClientUnscoped(
  clientLog("info", "[authStore] Starting main auth processing stream..."),
);
runClientUnscoped(authProcess);
proposeAuthAction({ type: "AUTH_CHECK_START" });
