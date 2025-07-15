// bun-server.ts
import { HttpRouter } from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Effect, Layer } from "effect";

// Service and Config Layers
import { ObservabilityLive } from "./src/lib/server/observability";
import { DbLayer } from "./src/db/DbLayer";
// ✅ Import the HTTP middleware, not just the AuthMiddleware for RPC
import { AuthMiddlewareLive, httpAuthMiddleware } from "./src/lib/server/auth";
import { CryptoLive } from "./src/lib/server/crypto";
import { S3UploaderLive } from "./src/lib/server/s3";
import { ConfigLive } from "./src/lib/server/Config";

// ... other imports for RPCs, handlers, etc.
import { AuthRpc } from "./src/lib/shared/api";
import { UserRpcs } from "./src/user";
import { RpcLog } from "./src/lib/shared/log-schema";
import { AuthRpcHandlers } from "./src/features/auth/auth.handler";
import { RpcUserHandlers } from "./src/user";
import { RpcLogHandlers } from "./src/features/log/log.handler";
import { UserHttpRoutes } from "./src/features/user/user.http"; // Import the clean router

// --- Define Handler and Dependency Layers (Unchanged) ---
const mergedRpc = AuthRpc.merge(UserRpcs).merge(RpcLog);
const allRpcHandlers = {
  ...AuthRpcHandlers,
  ...RpcUserHandlers,
  ...RpcLogHandlers,
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

    // --- RPC App Mounting (Unchanged) ---
    const rpcHttpApp = yield* rpcAppEffect.pipe(
      Effect.provide(RpcHandlersProviderLive),
      Effect.provide(AppAuthMiddlewareLive),
      Effect.provide(RpcSerialization.layerNdjson),
    );
    const selfContainedRpcApp = Effect.scoped(rpcHttpApp);
    yield* router.mountApp("/api/rpc", selfContainedRpcApp);

    // --- ✅ FIX: Mount and apply middleware here ---
    const protectedUserRoutes = HttpRouter.empty.pipe(
      // 1. Mount the clean user routes under the /api/user prefix
      HttpRouter.mountApp("/api/user", UserHttpRoutes),
      // 2. Apply the HTTP authentication middleware to this entire group
      HttpRouter.use(httpAuthMiddleware),
    );

    // Provide the dependencies needed by the protected routes AND their middleware
    const selfContainedUserRoutes = protectedUserRoutes.pipe(
      Effect.provide(DbLayer),
      Effect.provide(S3UploaderLive),
      Effect.provide(ConfigLive),
    );

    // Mount the final, self-contained, and protected user app to the main router
    yield* router.mountApp("/", selfContainedUserRoutes);
  }),
);

// --- Compose and Launch Final Server (Unchanged) ---

const AppMain = HttpRouter.Default.serve().pipe(
  Layer.provide(ApplicationLive),
  Layer.provide(HttpRouter.Default.Live),
  Layer.provide(BunHttpServer.layer({ port: 42069 })),
  Layer.provide(ObservabilityLive),
);

const program = Layer.launch(AppMain);
const runnable = Effect.provide(program, Layer.scope);
BunRuntime.runMain(runnable);
