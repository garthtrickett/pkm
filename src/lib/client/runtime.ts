// src/lib/client/runtime.ts

import { Cause, Context, Effect, Exit, Layer, Runtime, Scope } from "effect";
import { FetchHttpClient, HttpClient } from "@effect/platform";
import { RequestInit as FetchRequestInit } from "@effect/platform/FetchHttpClient";
import { clientLog } from "./clientLog";
import { LocationLive, type LocationService } from "./LocationService";
import { RpcAuthClient, RpcLogClient } from "./rpc";

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
        clientLog(
          "debug",
          `ViewManager setting new cleanup function. Old one was ${
            currentCleanup ? "defined" : "undefined"
          }.`,
        );
        currentCleanup = cleanup;
      }),
    cleanup: () => {
      if (currentCleanup) {
        clientLog("debug", "ViewManager running cleanup function.");
        currentCleanup();
        currentCleanup = undefined;
      }
      return Effect.void;
    },
  });
});
// --- Final Context and Layer ---

export type ClientContext =
  | LocationService
  | RpcLogClient
  | ViewManager
  | HttpClient.HttpClient
  | RpcAuthClient;

// --- 🪵 EXHAUSTIVE LOG ---
const RequestInitLive = Layer.succeed(FetchRequestInit, {
  credentials: "include",
}).pipe(
  Layer.tap(() =>
    Effect.logDebug(
      "[runtime] RequestInitLive created with credentials: 'include'",
    ),
  ),
);

// --- 🪵 EXHAUSTIVE LOG ---
const CustomHttpClientLive = FetchHttpClient.layer.pipe(
  Layer.provide(RequestInitLive),
  Layer.tap(() => Effect.logDebug("[runtime] CustomHttpClientLive created")),
);

const rpcLayers = Layer.merge(RpcAuthClient.Default, RpcLogClient.Default);

// --- 🪵 EXHAUSTIVE LOG ---
const rpcAndHttpLayer = rpcLayers.pipe(
  Layer.provideMerge(CustomHttpClientLive),
  Layer.tap(() =>
    Effect.logDebug(
      "[runtime] rpcAndHttpLayer created by providing HttpClient to rpcLayers",
    ),
  ),
);

export const ClientLive: Layer.Layer<ClientContext, never, never> =
  Layer.mergeAll(LocationLive, ViewManagerLive, rpcAndHttpLayer);

// --- Runtime Setup ---

const appScope = Effect.runSync(Scope.make());

// --- 🪵 EXHAUSTIVE LOG ---
const AppRuntime = Effect.runSync(
  Scope.extend(
    Layer.toRuntime(ClientLive).pipe(
      Effect.tap(() =>
        Effect.logInfo(
          "[runtime] ClientLive Layer has been built and is being converted to a Runtime.",
        ),
      ),
    ),
    appScope,
  ),
);
export const clientRuntime = AppRuntime;

export const runClientPromise = <A, E>(
  effect: Effect.Effect<A, E, ClientContext>,
) => {
  return Runtime.runPromise(clientRuntime)(effect);
};

export const runClientUnscoped = <A, E>(
  effect: Effect.Effect<A, E, ClientContext>,
) => {
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
      runClientUnscoped(
        clientLog(
          "error",
          {
            source: `GLOBAL_CATCH_${errorSource.toUpperCase().replace(" ", "_")}`,
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
