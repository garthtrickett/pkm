// bun-server.ts
import { HttpRouter } from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Effect, Layer } from "effect";

// Service and Config Layers
import { ObservabilityLive } from "./src/lib/server/observability";
import { DbLayer } from "./src/db/DbLayer";
import { AuthMiddlewareLive, httpAuthMiddleware } from "./src/lib/server/auth";
import { CryptoLive } from "./src/lib/server/crypto";
import { S3UploaderLive } from "./src/lib/server/s3";
import { ConfigLive } from "./src/lib/server/Config";

// RPC and Handler Imports
import { AuthRpc, ReplicacheRpc } from "./src/lib/shared/api";
import { UserRpcs } from "./src/user";
import { RpcLog } from "./src/lib/shared/log-schema";
import { AuthRpcHandlers } from "./src/features/auth/auth.handler";
import { RpcUserHandlers } from "./src/user";
import { ReplicacheHandlers } from "./src/features/replicache/replicache.handler";
import { RpcLogHandlers } from "./src/features/log/log.handler";
import { UserHttpRoutes } from "./src/features/user/user.http";

// --- Define Handler and Dependency Layers ---

// ✅ **FIX 1: Merge the ReplicacheRpc definitions.**
const mergedRpc = AuthRpc.merge(UserRpcs).merge(RpcLog).merge(ReplicacheRpc);

// ✅ **FIX 2: Add the ReplicacheHandlers to the handler object.**
const allRpcHandlers = {
  ...AuthRpcHandlers,
  ...RpcUserHandlers,
  ...RpcLogHandlers,
  ...ReplicacheHandlers,
};

const HandlerDependenciesLive = Layer.mergeAll(DbLayer, CryptoLive);
const RpcHandlersProviderLive = mergedRpc
  .toLayer(allRpcHandlers)
  .pipe(Layer.provide(HandlerDependenciesLive));
const AppAuthMiddlewareLive = AuthMiddlewareLive.pipe(Layer.provide(DbLayer));
const rpcAppEffect = RpcServer.toHttpApp(mergedRpc);

// --- Create the Main Application Layer ---

const ApplicationLive = Layer.effectDiscard(
  Effect.gen(function* () {
    const router = yield* HttpRouter.Default;

    // --- RPC App Mounting ---
    const rpcHttpApp = yield* rpcAppEffect.pipe(
      Effect.provide(RpcHandlersProviderLive),
      Effect.provide(AppAuthMiddlewareLive),
      Effect.provide(RpcSerialization.layerNdjson),
    );
    const selfContainedRpcApp = Effect.scoped(rpcHttpApp);
    yield* router.mountApp("/api/rpc", selfContainedRpcApp);

    // --- HTTP User Routes Mounting ---
    const protectedUserRoutes = HttpRouter.empty.pipe(
      HttpRouter.mountApp("/api/user", UserHttpRoutes),
      HttpRouter.use(httpAuthMiddleware),
    );

    const selfContainedUserRoutes = protectedUserRoutes.pipe(
      Effect.provide(DbLayer),
      Effect.provide(S3UploaderLive),
      Effect.provide(ConfigLive),
    );

    yield* router.mountApp("/", selfContainedUserRoutes);
  }),
);

// --- Compose and Launch Final Server ---

const AppMain = HttpRouter.Default.serve().pipe(
  Layer.provide(ApplicationLive),
  Layer.provide(HttpRouter.Default.Live),
  Layer.provide(BunHttpServer.layer({ port: 42069 })),
  Layer.provide(ObservabilityLive),
);

const program = Layer.launch(AppMain);
const runnable = Effect.provide(program, Layer.scope);
BunRuntime.runMain(runnable);
