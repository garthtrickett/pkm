// FILE: ./src/lib/client/stores/authStore.ts
import { signal } from "@preact/signals-core";
import { Effect, Queue, Stream, Runtime } from "effect";
import type { PublicUser } from "../../shared/schemas";
import { AppRuntime, runClientUnscoped } from "../runtime";
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
type AuthAction =
  | { type: "AUTH_CHECK_START" }
  | { type: "LOGOUT_START" }
  | { type: "LOGOUT_SUCCESS" }
  | { type: "SET_AUTHENTICATED"; payload: PublicUser }
  | { type: "SET_UNAUTHENTICATED" };

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
      return { status: "authenticating", user: null };
    case "LOGOUT_START":
      return { status: "authenticating", user: model.user };
    case "SET_AUTHENTICATED":
      return { status: "authenticated", user: action.payload };
    case "LOGOUT_SUCCESS":
    case "SET_UNAUTHENTICATED":
      return { status: "unauthenticated", user: null };
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
        authState.value = update(authState.value, action); // Set to 'authenticating'

        yield* Effect.forkDaemon(
          Effect.gen(function* () {
            const result = yield* Effect.either(authClient.me());
            if (result._tag === "Right") {
              proposeAuthAction({
                type: "SET_AUTHENTICATED",
                payload: result.right,
              });
            } else {
              proposeAuthAction({ type: "SET_UNAUTHENTICATED" });
            }
          }),
        );
        break;
      }
      case "SET_AUTHENTICATED": {
        // The runtimeManager will see this state change and initialize the runtime.
        authState.value = update(authState.value, action);
        break;
      }
      case "SET_UNAUTHENTICATED": {
        // New case
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
          "[authStore] LOGOUT_SUCCESS: updating state and cleaning up.",
        );
        localStorage.removeItem("jwt");
        document.cookie =
          "session_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        authState.value = update(authState.value, action);
        yield* navigate("/login");
        break;
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

/**
 * Starts the auth store's background process.
 * This should be called once when the application initializes.
 */
export const initializeAuthStore = (): void => {
  Runtime.runFork(AppRuntime)(authProcess);
};
