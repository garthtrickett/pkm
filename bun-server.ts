import { HttpRouter } from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Layer } from "effect";
import { RpcAuth } from "./src/api";
import { RpcAuthLayer } from "./src/server";

// 1. Create the complete RPC server layer
// This combines the RPC Server "engine" with your implementation
const RpcLayer = RpcServer.layer(RpcAuth).pipe(Layer.provide(RpcAuthLayer));

// 2. Define the protocol and serialization format
const HttpProtocol = RpcServer.layerProtocolHttp({
  path: "/api/rpc",
}).pipe(Layer.provide(RpcSerialization.layerNdjson));

// 3. Create the main server layer, providing the new RpcLayer
const Main = HttpRouter.Default.serve().pipe(
  Layer.provide(RpcLayer), // Use the new complete layer
  Layer.provide(HttpProtocol),
  Layer.provide(BunHttpServer.layer({ port: 42069 })),
);

BunRuntime.runMain(Layer.launch(Main));
