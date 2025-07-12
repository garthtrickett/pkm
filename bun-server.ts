// bun-server.ts
import { HttpRouter } from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Layer } from "effect";
import { RpcAuth } from "./src/api";
import { AuthMiddlewareLive } from "./src/auth";
import { LoggerLive } from "./src/lib/server/logger.server";
import { RpcLog, RpcLogLayer } from "./src/log";
import { RpcAuthLayer } from "./src/server";
import { RpcUserLayer, UserRpcs } from "./src/user";

// 1. Merge all handler layers together, including the new RpcLogLayer
const RpcHandlers = Layer.mergeAll(RpcAuthLayer, RpcUserLayer, RpcLogLayer);

// 2. Merge the RPC groups, including the new RpcLog group
const AppRpcs = RpcAuth.merge(UserRpcs).merge(RpcLog);

// 3. Create the complete RPC server layer from the merged groups and handlers
const RpcLayer = RpcServer.layer(AppRpcs).pipe(
  Layer.provide(RpcHandlers),
  Layer.provide(AuthMiddlewareLive),
);

// 4. Define the protocol and serialization format
const HttpProtocol = RpcServer.layerProtocolHttp({
  path: "/api/rpc",
}).pipe(Layer.provide(RpcSerialization.layerNdjson));

// 5. Create the main server layer, providing the LoggerLive service globally
const Main = HttpRouter.Default.serve().pipe(
  Layer.provide(RpcLayer),
  Layer.provide(HttpProtocol),
  Layer.provide(BunHttpServer.layer({ port: 42069 })),
  Layer.provide(LoggerLive), // Provide the logger for the entire application
);

BunRuntime.runMain(Layer.launch(Main));
