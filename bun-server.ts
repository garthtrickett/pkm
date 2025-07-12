// bun-server.ts
import { HttpRouter } from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Layer } from "effect";
import { RpcAuth } from "./src/api";
import { AuthMiddlewareLive } from "./src/auth";
import { RpcAuthLayer } from "./src/server";
import { RpcUserLayer, UserRpcs } from "./src/user";

// 1. Merge the handler layers together
const RpcHandlers = Layer.merge(RpcAuthLayer, RpcUserLayer);

// 2. Merge the RPC groups into a single group
//    The .merge() method is called on a group instance.
const AppRpcs = RpcAuth.merge(UserRpcs);

// 3. Create the complete RPC server layer using the single merged group
const RpcLayer = RpcServer.layer(AppRpcs).pipe(
  Layer.provide(RpcHandlers),
  Layer.provide(AuthMiddlewareLive),
);

// 4. Define the protocol and serialization format
const HttpProtocol = RpcServer.layerProtocolHttp({
  path: "/api/rpc",
}).pipe(Layer.provide(RpcSerialization.layerNdjson));

// 5. Create the main server layer
const Main = HttpRouter.Default.serve().pipe(
  Layer.provide(RpcLayer),
  Layer.provide(HttpProtocol),
  Layer.provide(BunHttpServer.layer({ port: 42069 })),
);

BunRuntime.runMain(Layer.launch(Main));
