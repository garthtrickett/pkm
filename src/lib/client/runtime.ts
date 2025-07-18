// FILE: ./src/lib/client/runtime.ts
import {
  Cause,
  Effect,
  Exit,
  Layer,
  Runtime,
  Scope,
  ExecutionStrategy,
} from "effect";
import { FetchHttpClient, HttpClient } from "@effect/platform";
import { RequestInit as FetchRequestInit } from "@effect/platform/FetchHttpClient";
import { clientLog } from "./clientLog";
import { LocationLive, type LocationService } from "./LocationService";
import {
  RpcAuthClient,
  RpcAuthClientLive,
  RpcLogClientLive,
  RpcLogClient,
} from "./rpc";
import { authState } from "./stores/authStore";
import { ReplicacheLive, ReplicacheService } from "./replicache";
import type { PublicUser } from "../shared/schemas";

// --- Context Definitions ---
export type BaseClientContext =
  | LocationService
  | RpcLogClient
  | HttpClient.HttpClient
  | RpcAuthClient;
export type FullClientContext = BaseClientContext | ReplicacheService;

// --- Layer Setup ---
const RequestInitLive = Layer.succeed(FetchRequestInit, {
  credentials: "include",
});
const CustomHttpClientLive = FetchHttpClient.layer.pipe(
  Layer.provide(RequestInitLive),
);

const rpcLayers = Layer.mergeAll(RpcAuthClientLive, RpcLogClientLive);
const rpcAndHttpLayer = rpcLayers.pipe(
  Layer.provideMerge(CustomHttpClientLive),
);
export const BaseClientLive: Layer.Layer<BaseClientContext> = Layer.mergeAll(
  LocationLive,
  rpcAndHttpLayer,
);

// --- Runtime Setup ---
const appScope = Effect.runSync(Scope.make());
let replicacheScope: Scope.CloseableScope | null = null;

const AppRuntime = Effect.runSync(
  Scope.extend(Layer.toRuntime(BaseClientLive), appScope),
);
export let clientRuntime: Runtime.Runtime<FullClientContext> =
  AppRuntime as Runtime.Runtime<FullClientContext>;

/**
 * An effect to initialize the Replicache service and update the global runtime.
 * This should be called ONLY when a user is authenticated.
 */
export const initializeReplicacheRuntime = (user: PublicUser) =>
  Effect.gen(function* () {
    if (replicacheScope) {
      yield* Scope.close(replicacheScope, Exit.succeed(undefined));
    }

    const newScope = yield* Scope.fork(appScope, ExecutionStrategy.sequential);
    replicacheScope = newScope;

    const replicacheLayer = ReplicacheLive(user);
    const fullLayer = Layer.merge(BaseClientLive, replicacheLayer);
    const newRuntime = yield* Scope.extend(
      Layer.toRuntime(fullLayer),
      newScope,
    );

    clientRuntime = newRuntime;
    yield* clientLog(
      "info",
      "[runtime] Replicache runtime initialized and activated.",
    );
  });

/**
 * An effect to shut down the Replicache service and revert the runtime.
 * This should be called on logout.
 */
export const shutdownReplicacheRuntime = Effect.gen(function* () {
  if (replicacheScope) {
    yield* Scope.close(replicacheScope, Exit.succeed(undefined));
    replicacheScope = null;
    // Revert to the base runtime
    clientRuntime = AppRuntime as Runtime.Runtime<FullClientContext>;
    yield* clientLog("info", "[runtime] Replicache runtime shut down.");
  }
});

// --- Effect Runners ---
export const runClientPromise = <A, E>(
  effect: Effect.Effect<A, E, FullClientContext>,
) => {
  if (authState.value.status !== "authenticated") {
    const error = new Error(
      "runClientPromise called without an authenticated user.",
    );
    console.error(error.message, { effect });
    return Promise.reject(error);
  }
  return Runtime.runPromise(clientRuntime)(effect);
};

// ✅ FIX: The context type is updated to FullClientContext.
// This allows the runner to correctly execute effects that depend on the ReplicacheService.
export const runClientUnscoped = <A, E>(
  effect: Effect.Effect<A, E, FullClientContext>,
) => {
  return Runtime.runFork(clientRuntime)(effect);
};

export const shutdownClient = () =>
  Effect.runPromise(Scope.close(appScope, Exit.succeed(undefined)));

// --- Global Error Handling (unchanged) ---
const setupGlobalErrorLogger = () => {
  const handler =
    (errorSource: string) => (event: ErrorEvent | PromiseRejectionEvent) => {
      const errorCandidate: unknown =
        "reason" in event ? event.reason : event.error;

      const error = Cause.isCause(errorCandidate)
        ? Cause.squash(errorCandidate)
        : errorCandidate;
      runClientUnscoped(
        clientLog(
          "error",
          {
            source: `GLOBAL_CATCH_${errorSource
              .toUpperCase()
              .replace(" ", "_")}`,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          },
          "A global error was caught",
        ),
      );
    };

  window.addEventListener("error", handler("Uncaught Exception"));
  window.addEventListener("unhandledrejection", handler("Unhandled Rejection"));

  runClientUnscoped(
    clientLog("info", "Global error logger initialized.", undefined, "Runtime"),
  );
};

setupGlobalErrorLogger();
