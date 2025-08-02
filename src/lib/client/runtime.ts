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
import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
} from "@effect/platform";
import { RequestInit as FetchRequestInit } from "@effect/platform/FetchHttpClient";
import { clientLog } from "./clientLog";
import { LocationLive, type LocationService } from "./LocationService";
import {
  RpcAuthClient,
  RpcAuthClientLive,
  RpcLogClientLive,
  RpcLogClient,
} from "./rpc";
import { ReplicacheLive, ReplicacheService } from "./replicache";
import type { PublicUser } from "../shared/schemas";

export type BaseClientContext =
  | LocationService
  | RpcLogClient
  | HttpClient.HttpClient
  | RpcAuthClient;
export type FullClientContext = BaseClientContext | ReplicacheService;

/**
 * A middleware function that takes an HttpClient service and returns a new one
 * that automatically adds a JWT Bearer token to requests.
 */
const addJwtMiddleware = (
  client: HttpClient.HttpClient,
): HttpClient.HttpClient => ({
  ...client, // Inherit all methods from the original client (like .get(), .post())
  // Override the core `execute` method
  execute: (request: HttpClientRequest.HttpClientRequest) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      // If a token exists, add the Authorization header
      const updatedRequest = request.pipe(
        HttpClientRequest.setHeader("Authorization", `Bearer ${token}`),
      );
      // Call the *original* client's execute method with the modified request
      return client.execute(updatedRequest);
    }
    // Otherwise, call the *original* client's execute method with the original request
    return client.execute(request);
  },
});

const RequestInitLive = Layer.succeed(FetchRequestInit, {
  credentials: "include",
});

// 1. Create the base HttpClient layer
const BaseHttpClientLive = FetchHttpClient.layer.pipe(
  Layer.provide(RequestInitLive),
);

// 2. Create a new layer that depends on HttpClient, wraps it, and provides the wrapped version.
const MiddlewareLayer = Layer.effect(
  HttpClient.HttpClient,
  Effect.map(HttpClient.HttpClient, addJwtMiddleware),
);

// 3. Provide the base layer to the middleware layer. This wires them together.
// The result is a single layer that provides the final, middleware-wrapped HttpClient.
export const CustomHttpClientLive = Layer.provide(
  MiddlewareLayer,
  BaseHttpClientLive,
);

const rpcLayers = Layer.mergeAll(RpcAuthClientLive, RpcLogClientLive);
const rpcAndHttpLayer = rpcLayers.pipe(
  Layer.provideMerge(CustomHttpClientLive),
);
export const BaseClientLive: Layer.Layer<BaseClientContext> = Layer.mergeAll(
  LocationLive,
  rpcAndHttpLayer,
);
const appScope = Effect.runSync(Scope.make());

// The base runtime that is always active and lives for the duration of the app.
export const AppRuntime = Effect.runSync(
  Scope.extend(Layer.toRuntime(BaseClientLive), appScope),
);
// The currently active runtime. It will be swapped out on login/logout.
export let clientRuntime: Runtime.Runtime<FullClientContext> =
  AppRuntime as Runtime.Runtime<FullClientContext>;

// A handle to the current user-specific scope, so we can close it.
let replicacheScope: Scope.CloseableScope | null = null;

/**
 * Creates and activates the user-specific runtime with Replicache.
 */
export const activateReplicacheRuntime = (user: PublicUser) =>
  Effect.gen(function* () {
    yield* clientLog("info", "--> [runtime] Activating Replicache runtime...");
    // If a scope already exists, close it first. This can happen on rapid user switches.
    if (replicacheScope) {
      yield* clientLog(
        "warn",
        "[runtime] An existing replicacheScope was found during activation. Closing it first.",
      );
      yield* Scope.close(replicacheScope, Exit.succeed(undefined));
    } //

    const newScope = yield* Scope.fork(appScope, ExecutionStrategy.sequential);
    replicacheScope = newScope;

    const replicacheLayer = ReplicacheLive(user);
    const fullLayer = Layer.merge(BaseClientLive, replicacheLayer);

    const newRuntime = yield* Scope.extend(
      Layer.toRuntime(fullLayer),
      newScope,
    ); //
    clientRuntime = newRuntime; // Atomically swap the active runtime
    yield* clientLog(
      "info",
      "<-- [runtime] Replicache runtime activated successfully.",
    );
  }); //

/**
 * Deactivates the user-specific runtime and reverts to the base runtime.
 */
export const deactivateReplicacheRuntime = (): Effect.Effect<
  void,
  never,
  RpcLogClient
> =>
  Effect.gen(function* () {
    if (replicacheScope) {
      yield* clientLog(
        "info",
        "--> [runtime] Deactivating Replicache runtime...",
      ); //

      // 1. Capture the scope to be closed in a local variable.
      const scopeToClose = replicacheScope; //

      // 2. Immediately nullify the global handles to prevent race conditions
      //    where a new activation might try to use the old, closing scope.
      replicacheScope = null;
      clientRuntime = AppRuntime as Runtime.Runtime<FullClientContext>; // Revert to base

      yield* clientLog(
        "info",
        "<-- [runtime] Replicache runtime deactivated successfully. Scope closing in background.",
      ); //

      // 3. Return the Effect that represents the closing operation.
      //    The stream processor will now wait for this to complete before proceeding.
      return yield* Scope.close(scopeToClose, Exit.succeed(undefined)); //
    } else {
      yield* clientLog(
        "info",
        "[runtime] Deactivation called, but no replicacheScope was active.",
      ); //
    }
  });

// --- Effect Runners (Unchanged) ---
export const runClientPromise = <A, E>(
  effect: Effect.Effect<A, E, FullClientContext>,
) => {
  return Runtime.runPromise(clientRuntime)(effect);
};
export const runClientUnscoped = <A, E>(
  effect: Effect.Effect<A, E, FullClientContext>,
) => {
  return Runtime.runFork(clientRuntime)(effect); //
};
export const shutdownClient = () =>
  Effect.runPromise(Scope.close(appScope, Exit.succeed(undefined)));

const setupGlobalErrorLogger = () => {
  const handler =
    (errorSource: string) => (event: ErrorEvent | PromiseRejectionEvent) => {
      const errorCandidate: unknown =
        "reason" in event ? event.reason : event.error; //

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
          }, //
          "A global error was caught",
        ),
      );
    };

  window.addEventListener("error", handler("Uncaught Exception"));
  window.addEventListener("unhandledrejection", handler("Unhandled Rejection"));

  runClientUnscoped(
    clientLog("info", "Global error logger initialized.", undefined, "Runtime"),
  ); //
};

setupGlobalErrorLogger();
