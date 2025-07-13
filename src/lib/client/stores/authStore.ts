// src/lib/client/stores/authStore.ts
import { signal } from "@preact/signals-core";
import { Data, Effect, Layer, Queue, Stream } from "effect";
import { FetchHttpClient } from "@effect/platform";
import { RpcClient, RpcSerialization } from "@effect/rpc";
import type { User } from "../../../types/generated/public/User";
import { ClientLive, runClientUnscoped } from "../runtime";
import { AuthError, AuthRpc } from "../../shared/api";
import { clientLog, RpcLogClient } from "../clientLog";

// --- RPC Client Service Definition ---
const AuthProtocolLive = RpcClient.layerProtocolHttp({
  url: "/api/rpc",
}).pipe(Layer.provide(RpcSerialization.layerNdjson));

export class RpcAuthClient extends Effect.Service<RpcAuthClient>()(
  "RpcAuthClient",
  {
    dependencies: [AuthProtocolLive],
    scoped: RpcClient.make(AuthRpc),
  },
) {}

const RpcAuthClientLive = RpcAuthClient.Default.pipe(
  Layer.provide(FetchHttpClient.layer),
);

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
  runClientUnscoped(
    clientLog(
      "info",
      `[authStore] Proposing action: ${action.type}`,
    ),
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
    authState.value = update(authState.value, action);
    yield* clientLog(
      "info",
      `[authStore] State updated to: ${authState.value.status}`,
    );

    const authClient = yield* RpcAuthClient;

    switch (action.type) {
      case "AUTH_CHECK_START": {
        yield* clientLog(
          "info",
          "[authStore] Awaiting RPC call: authClient.me()",
        );

        // ✅ ✅ ✅ THE FIX IS HERE ✅ ✅ ✅
        // We no longer fork the effect. We `yield*` it, making this step
        // "blocking" within the action handler. The handler will not complete
        // until the RPC call succeeds or fails.
        const result = yield* Effect.either(authClient.me());

        // Now we can handle the result directly and synchronously propose the next action.
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
        // This logic can also be simplified, though it wasn't the source of the bug.
        yield* Effect.either(authClient.logout());
        proposeAuthAction({ type: "LOGOUT_SUCCESS" });
        break;
      }
    }
  });

// --- Main Loop ---
const RpcClientsLive = Layer.merge(RpcAuthClientLive, RpcLogClient.Default);

const authProcess = Stream.fromQueue(_actionQueue).pipe(
  // The `runForEach` now correctly waits for each action handler to fully complete,
  // including the RPC call, before processing the next action.
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
