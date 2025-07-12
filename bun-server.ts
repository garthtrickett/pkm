// bun-server.ts
import { HttpRouter } from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Layer } from "effect";

// Core Services
import { DbLayer } from "./src/db/DbLayer";
import { LoggerLive } from "./src/lib/server/logger.server";
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

// 1. Combine all RPC handler implementations into a single layer.
const RpcHandlers = Layer.mergeAll(AuthRpcLayer, RpcUserLayer, RpcLogLayer);

// 2. Combine all RPC schemas into a single API definition.
const AppRpcs = AuthRpc.merge(UserRpcs).merge(RpcLog);

// 3. Create the complete RPC server layer.
// This layer's dependency `Handler<"SignUpRequest">` is now correctly
// satisfied by the provided `RpcHandlers` layer.
const RpcLayer = RpcServer.layer(AppRpcs).pipe(Layer.provide(RpcHandlers));

// 4. Define the HTTP transport protocol and serialization format.
const HttpProtocol = RpcServer.layerProtocolHttp({
  path: "/api/rpc",
}).pipe(Layer.provide(RpcSerialization.layerNdjson));

// 5. Create the main server layer, providing all global services.
const Main = HttpRouter.Default.serve().pipe(
  Layer.provide(RpcLayer),
  Layer.provide(HttpProtocol),
  Layer.provide(BunHttpServer.layer({ port: 42069 })),
  Layer.provide(AuthMiddlewareLive),
  Layer.provide(DbLayer),
  Layer.provide(LoggerLive),
  Layer.provide(CryptoLive),
);

// 6. Launch the application.
BunRuntime.runMain(Layer.launch(Main));
