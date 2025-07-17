// src/lib/client/runtime.ts
import { Cause, Context, Effect, Exit, Layer, Runtime, Scope } from "effect";
import { FetchHttpClient, HttpClient } from "@effect/platform";
import { RequestInit as FetchRequestInit } from "@effect/platform/FetchHttpClient";
import { clientLog } from "./clientLog";
import { LocationLive, type LocationService } from "./LocationService";
import {
  RpcAuthClient,
  RpcAuthClientLive,
  RpcLogClientLive,
  RpcLogClient,
  RpcReplicacheClient,
  RpcReplicacheClientLive,
} from "./rpc";
import { authState } from "./stores/authStore";
import { ReplicacheLive, ReplicacheService } from "./replicache";

// --- Service Definitions ---

export class ViewManager extends Context.Tag("ViewManager")<
  ViewManager,
  {
    readonly set: (cleanup: (() => void) | undefined) => Effect.Effect<void>;
    readonly cleanup: () => Effect.Effect<void>;
  }
>() {}

export const ViewManagerLive = Layer.sync(ViewManager, () => {
  let currentCleanup: (() => void) | undefined = undefined;
  return ViewManager.of({
    set: (cleanup) =>
      Effect.sync(() => {
        // We can't use clientLog here as the logger itself is being constructed.
        // This is a rare case where console.debug is acceptable.
        console.debug(
          `ViewManager setting new cleanup function. Old one was ${
            currentCleanup ? "defined" : "undefined"
          }.`,
        );
        currentCleanup = cleanup;
      }),
    cleanup: () => {
      if (currentCleanup) {
        console.debug("ViewManager running cleanup function.");
        currentCleanup();
        currentCleanup = undefined;
      }
      return Effect.void;
    },
  });
});

// --- Final Context and Layer ---

// Define a context with only the services that are always available.
export type BaseClientContext =
  | LocationService
  | RpcLogClient
  | ViewManager
  | HttpClient.HttpClient
  | RpcAuthClient
  | RpcReplicacheClient;

// Define a full context that includes the authentication-dependent ReplicacheService.
export type FullClientContext = BaseClientContext | ReplicacheService;

// --- Layer Setup ---

const RequestInitLive = Layer.succeed(FetchRequestInit, {
  credentials: "include",
});

const CustomHttpClientLive = FetchHttpClient.layer.pipe(
  Layer.provide(RequestInitLive),
);

// Merge all RPC client layers.
const rpcLayers = Layer.mergeAll(
  RpcAuthClientLive,
  RpcLogClientLive,
  RpcReplicacheClientLive,
);

// Provide the HttpClient to the RPC layers.
const rpcAndHttpLayer = rpcLayers.pipe(
  Layer.provideMerge(CustomHttpClientLive),
);

// This is the static, base layer for all unauthenticated operations.
export const BaseClientLive: Layer.Layer<BaseClientContext> = Layer.mergeAll(
  LocationLive,
  ViewManagerLive,
  rpcAndHttpLayer,
);

// --- Runtime Setup ---

const appScope = Effect.runSync(Scope.make());

// Create a single, static runtime from the base layer.
const AppRuntime = Effect.runSync(
  Scope.extend(Layer.toRuntime(BaseClientLive), appScope),
);

export const clientRuntime = AppRuntime;

// --- Effect Runners ---

// This runner is for effects that require the full, authenticated context.
export const runClientPromise = <A, E>(
  effect: Effect.Effect<A, E, FullClientContext>,
) => {
  const currentUser = authState.value.user;
  if (!currentUser) {
    const error = new Error(
      "runClientPromise called without an authenticated user.",
    );
    console.error(error.message, { effect });
    return Promise.reject(error);
  }

  // Provide the dynamic, user-specific Replicache layer to the effect before running.
  const effectWithAuth = Effect.provide(effect, ReplicacheLive(currentUser));

  // Run the enhanced effect using the base runtime.
  return Runtime.runPromise(clientRuntime)(effectWithAuth);
};

// This runner is for effects that only need the base, unauthenticated context.
export const runClientUnscoped = <A, E>(
  effect: Effect.Effect<A, E, BaseClientContext>,
) => {
  // The type of `effect` now correctly matches what `clientRuntime` can handle, so no assertion is needed.
  return Runtime.runFork(clientRuntime)(effect);
};

export const shutdownClient = () =>
  Effect.runPromise(Scope.close(appScope, Exit.succeed(undefined)));

// --- Global Error Handling ---

const setupGlobalErrorLogger = () => {
  const handler =
    (errorSource: string) => (event: ErrorEvent | PromiseRejectionEvent) => {
      const errorCandidate: unknown =
        "reason" in event ? event.reason : event.error;

      const error = Cause.isCause(errorCandidate)
        ? Cause.squash(errorCandidate)
        : errorCandidate;

      // This call is now type-safe.
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

// Initialize the global handler.
setupGlobalErrorLogger();
