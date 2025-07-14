// bun-server.ts
import { HttpRouter } from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Layer } from "effect";
import { ObservabilityLive } from "./src/lib/server/observability";

// Core Services
import { DbLayer } from "./src/db/DbLayer";
import { AuthMiddlewareLive } from "./src/lib/server/auth";
import { CryptoLive } from "./src/lib/server/crypto";

// RPC Schemas
import { AuthRpc } from "./src/lib/shared/api";
import { UserRpcs } from "./src/user";
import { RpcLog } from "./src/lib/shared/log-schema";

// RPC Handlers
import { AuthRpcLayer } from "./src/features/auth/auth.handler";
import { RpcUserLayer } from "./src/user";
import { RpcLogLayer } from "./src/features/log/log.handler";

// 1. Combine all RPC handler implementations.
const RpcHandlers = Layer.mergeAll(AuthRpcLayer, RpcUserLayer, RpcLogLayer);

// 2. Combine all RPC schemas into a single API definition.
const AppRpcs = AuthRpc.merge(UserRpcs).merge(RpcLog);

// 3. Define a layer for the handlers' dependencies.
const HandlerDependencies = Layer.mergeAll(DbLayer, CryptoLive);

// 4. Create the complete RPC server layer.
const RpcLayer = RpcServer.layer(AppRpcs).pipe(
  Layer.provide(RpcHandlers),
  Layer.provide(HandlerDependencies),
);

// 5. Define the HTTP transport protocol.
const HttpProtocol = RpcServer.layerProtocolHttp({
  path: "/api/rpc",
}).pipe(Layer.provide(RpcSerialization.layerNdjson));

// 6. ✅ NEW: Create a self-contained AuthMiddleware layer with its DB dependency.
const AppAuthMiddleware = AuthMiddlewareLive.pipe(Layer.provide(DbLayer));

// 7. ✅ MODIFIED: Create the main server layer using the new AppAuthMiddleware.
const Main = HttpRouter.Default.serve().pipe(
  Layer.provide(RpcLayer),
  Layer.provide(HttpProtocol),
  Layer.provide(BunHttpServer.layer({ port: 42069 })),
  Layer.provide(AppAuthMiddleware),
  Layer.provide(ObservabilityLive),
);

// 8. Launch the application.
BunRuntime.runMain(Layer.launch(Main));
