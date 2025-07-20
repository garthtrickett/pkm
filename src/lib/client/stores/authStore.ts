// FILE: ./src/lib/client/stores/authStore.ts
import { signal } from "@preact/signals-core";
import { Data, Effect, Queue, Stream, Runtime } from "effect";
import type { PublicUser } from "../../shared/schemas";
import { AppRuntime, runClientUnscoped } from "../runtime";
import { AuthError } from "../../shared/api";
import { clientLog } from "../clientLog";
import { RpcAuthClient, RpcLogClient } from "../rpc";
import { navigate } from "../router";
import type { LocationService } from "../LocationService";

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
class AuthCheckError extends Data.TaggedError("AuthCheckError")<{
  cause: unknown;
}> {}
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

const handleAuthAction = (
  action: AuthAction,
): Effect.Effect<void, Error, RpcAuthClient | RpcLogClient | LocationService> =>
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
        // The runtimeManager will see this state change and initialize the runtime.
        authState.value = update(authState.value, action);
        break;
      }
      case "AUTH_CHECK_FAILURE": {
        // The runtimeManager will see this state change and shut down the runtime.
        authState.value = update(authState.value, action);
        break;
      }
      case "LOGOUT_START": {
        authState.value = update(authState.value, action);
        yield* Effect.either(authClient.logout());
        proposeAuthAction({ type: "LOGOUT_SUCCESS" });
        break;
      }

      case "LOGOUT_SUCCESS": {
        yield* clientLog(
          "info",
          "[authStore] LOGOUT_SUCCESS action handler started.",
        );

        // --- START OF FIX ---

        // This effect is now much simpler. It no longer needs to know
        // about Replicache's database.
        const logoutCleanup = Effect.gen(function* () {
          yield* clientLog("info", "--> [logoutCleanup] Starting.");

          // 1. Clear the session cookie
          document.cookie =
            "session_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

          // 2. Update the application's auth state. This is the critical step
          //    that will trigger the `runtimeManager` in lifecycle.ts to call
          //    `deactivateReplicacheRuntime`, which in turn executes the
          //    correct cleanup logic (including IndexedDB deletion).
          authState.value = update(authState.value, action);
          yield* clientLog(
            "info",
            "[logoutCleanup] Auth state updated to unauthenticated. The runtimeManager will now handle resource cleanup.",
          );

          // 3. Redirect the user
          yield* navigate("/login");
          yield* clientLog("info", "<-- [logoutCleanup] Complete.");
        }).pipe(
          Effect.catchAll((err) =>
            clientLog("error", "[logoutCleanup] Cleanup failed", err),
          ),
        );

        // Fork this simplified cleanup logic.
        yield* Effect.forkDaemon(logoutCleanup);
        break;

        // --- END OF FIX ---
      }
    }
  });

const authProcess = Stream.fromQueue(_actionQueue).pipe(
  Stream.runForEach((action) =>
    handleAuthAction(action).pipe(
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

// The authProcess can now run safely on the base runtime as it doesn't
// manage scopes itself.
Runtime.runFork(AppRuntime)(authProcess);

proposeAuthAction({ type: "AUTH_CHECK_START" });
