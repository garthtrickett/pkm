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
import { RpcClient, RpcSerialization } from "@effect/rpc"; // Import RpcClient
import { clientLog } from "./clientLog";
import { LocationLive, LocationService } from "./LocationService";
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

const addJwtMiddleware = (
  client: HttpClient.HttpClient,
): HttpClient.HttpClient => ({
  ...client,
  execute: (request: HttpClientRequest.HttpClientRequest) => {
    const token = localStorage.getItem("jwt");

    // You can add this log to the client-side to confirm the middleware is running
    console.log(
      `🦖 [jwtMiddleware] Intercepting request to ${request.url}. Token: ${token ? "Found" : "Not Found"}`,
    );

    if (token) {
      const updatedRequest = request.pipe(
        HttpClientRequest.setHeader("Authorization", `Bearer ${token}`),
      );
      return client.execute(updatedRequest);
    }
    return client.execute(request);
  },
});

const RequestInitLive = Layer.succeed(FetchRequestInit, {
  credentials: "include",
});

const BaseHttpClientLive = FetchHttpClient.layer.pipe(
  Layer.provide(RequestInitLive),
);
const MiddlewareLayer = Layer.effect(
  HttpClient.HttpClient,
  Effect.map(HttpClient.HttpClient, addJwtMiddleware),
);
export const CustomHttpClientLive = Layer.provide(
  MiddlewareLayer,
  BaseHttpClientLive,
);

// ✅ --- THIS IS THE CORRECTED COMPOSITION ---

// 1. Define the RPC protocol layer here. It requires HttpClient and RpcSerialization.
const RpcProtocolLive = RpcClient.layerProtocolHttp({
  url: "/api/rpc",
});

// 2. Create a fully resolved RPC protocol by providing our custom HTTP client
//    and the JSON serialization layer directly to it.
const ResolvedRpcProtocol = RpcProtocolLive.pipe(
  Layer.provide(Layer.merge(CustomHttpClientLive, RpcSerialization.layerJson)),
);

// 3. Combine the simple, unresolved RPC client layers.
const RpcClientsLive = Layer.mergeAll(RpcAuthClientLive, RpcLogClientLive);

// 4. Provide the fully resolved protocol to the combined client layers.
//    This satisfies their need for an RpcClient.Protocol.
export const ResolvedRpcClients = RpcClientsLive.pipe(
  Layer.provide(ResolvedRpcProtocol),
);

// 5. The final base layer is now a simple merge of fully independent services.
export const BaseClientLive: Layer.Layer<
  BaseClientContext,
  never,
  Scope.Scope
> = Layer.mergeAll(LocationLive, ResolvedRpcClients, CustomHttpClientLive);

// --- The rest of the file remains the same ---
const appScope = Effect.runSync(Scope.make());

export const AppRuntime = Effect.runSync(
  Scope.extend(Layer.toRuntime(BaseClientLive), appScope),
);

export let clientRuntime: Runtime.Runtime<FullClientContext> =
  AppRuntime as Runtime.Runtime<FullClientContext>;

let replicacheScope: Scope.CloseableScope | null = null;

export const activateReplicacheRuntime = (user: PublicUser) =>
  Effect.gen(function* () {
    yield* clientLog("info", "--> [runtime] Activating Replicache runtime...");
    if (replicacheScope) {
      yield* clientLog(
        "warn",
        "[runtime] An existing replicacheScope was found during activation. Closing it first.",
      );
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
      "<-- [runtime] Replicache runtime activated successfully.",
    );
  });

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
      );
      const scopeToClose = replicacheScope;
      replicacheScope = null;
      clientRuntime = AppRuntime as Runtime.Runtime<FullClientContext>;
      yield* clientLog(
        "info",
        "<-- [runtime] Replicache runtime deactivated successfully. Scope closing in background.",
      );
      return yield* Scope.close(scopeToClose, Exit.succeed(undefined));
    } else {
      yield* clientLog(
        "info",
        "[runtime] Deactivation called, but no replicacheScope was active.",
      );
    }
  });

export const runClientPromise = <A, E>(
  effect: Effect.Effect<A, E, FullClientContext>,
) => {
  return Runtime.runPromise(clientRuntime)(effect);
};

export const runClientUnscoped = <A, E>(
  effect: Effect.Effect<A, E, FullClientContext>,
) => {
  return Runtime.runFork(clientRuntime)(effect);
};

export const shutdownClient = () =>
  Effect.runPromise(Scope.close(appScope, Exit.succeed(undefined)));

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
