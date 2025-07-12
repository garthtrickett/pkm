// src/lib/client/runtime.ts
import { Cause, Effect, Exit, Layer, Runtime, Scope } from "effect";
import { clientLog, RpcLogClient } from "./clientLog";
import { LocationLive, type LocationService } from "./LocationService";
import { ViewManager, ViewManagerLive } from "./lifecycle";

/**
 * A type alias for all services available in the client-side context.
 */
export type ClientContext = LocationService | RpcLogClient | ViewManager;

/**
 * A combined Layer that provides live implementations for all client-side services.
 * As you add more services, you'll merge their "Live" layers here.
 */
export const ClientLive: Layer.Layer<ClientContext> = Layer.mergeAll(
  LocationLive,
  RpcLogClient.Default,
  ViewManagerLive,
);

// --- Runtime Setup ---

// Create a single, top-level scope for the entire application lifecycle.
const appScope = Effect.runSync(Scope.make());

// Build a runtime from our main client layer and extend it into the app's scope.
// This ensures that all scoped services (like RPC clients) are properly managed.
const AppRuntime = Effect.runSync(
  Scope.extend(Layer.toRuntime(ClientLive), appScope),
);

/**
 * The singleton runtime containing all live services for the client application.
 */
export const clientRuntime = AppRuntime;

/**
 * Executes a client-side Effect and returns a Promise of its result,
 * automatically providing all necessary client services.
 */
export const runClientPromise = <A, E>(
  effect: Effect.Effect<A, E, ClientContext>,
) => Runtime.runPromise(clientRuntime)(effect);

/**
 * Executes a client-side Effect in "fire-and-forget" mode, automatically
 * providing all necessary client services. This is the primary way components
 * will run effects.
 */
export const runClientUnscoped = <A, E>(
  effect: Effect.Effect<A, E, ClientContext>,
) => Runtime.runFork(clientRuntime)(effect);

/**
 * A dedicated function to gracefully shut down the client runtime's scope.
 * Useful if you ever need to perform a full manual teardown.
 */
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

      // Use runClientUnscoped to send the log without blocking.
      runClientUnscoped(
        clientLog("error", `[GLOBAL CATCH – ${errorSource}]`, error),
      );
    };

  window.addEventListener("error", handler("Uncaught Exception"));
  window.addEventListener("unhandledrejection", handler("Unhandled Rejection"));

  // Log that the global error handler is set up.
  runClientUnscoped(
    clientLog("info", "Global error logger initialized.", undefined, "Runtime"),
  );
};

// Initialize the global logger when the runtime is created.
setupGlobalErrorLogger();
