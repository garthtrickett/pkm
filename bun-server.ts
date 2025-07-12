// bun-server.ts
import { HttpRouter } from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Layer } from "effect";
import { DbLayer } from "./src/db/DbLayer";
import { AuthMiddlewareLive } from "./src/lib/server/auth";
import { LoggerLive } from "./src/lib/server/logger.server";
import { RpcAuth } from "./src/lib/shared/api";
import { RpcLog, RpcLogLayer } from "./src/log";
import { RpcAuthLayer } from "./src/server";
import { RpcUserLayer, UserRpcs } from "./src/user";

// Merge all handler layers together, including the new RpcLogLayer
const RpcHandlers = Layer.mergeAll(RpcAuthLayer, RpcUserLayer, RpcLogLayer);

// Merge the RPC groups, including the new RpcLog group
const AppRpcs = RpcAuth.merge(UserRpcs).merge(RpcLog);

// Create the complete RPC server layer from the merged groups and handlers
const RpcLayer = RpcServer.layer(AppRpcs).pipe(
  Layer.provide(RpcHandlers),
  Layer.provide(AuthMiddlewareLive),
);

// Define the protocol and serialization format
const HttpProtocol = RpcServer.layerProtocolHttp({
  path: "/api/rpc",
}).pipe(Layer.provide(RpcSerialization.layerNdjson));

// Create the main server layer, providing all global services
const Main = HttpRouter.Default.serve().pipe(
  Layer.provide(RpcLayer),
  Layer.provide(HttpProtocol),
  Layer.provide(BunHttpServer.layer({ port: 42069 })),
  Layer.provide(LoggerLive),
  Layer.provide(DbLayer), //
);

BunRuntime.runMain(Layer.launch(Main));
