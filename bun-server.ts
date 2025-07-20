// FILE: ./bun-server.ts
import { HttpRouter, HttpServer } from "@effect/platform";
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
import { PokeServiceLive } from "./src/lib/server/PokeService";

// RPC and Handler Imports
import { AuthRpc } from "./src/lib/shared/api";
import { UserRpcs } from "./src/user";
import { RpcLog } from "./src/lib/shared/log-schema";
import { AuthRpcHandlers } from "./src/features/auth/auth.handler";
import { RpcUserHandlers } from "./src/user";
import { RpcLogHandlers } from "./src/features/log/log.handler";
import { UserHttpRoutes } from "./src/features/user/user.http";

// --- NEW IMPORTS for refactored routes ---
import { replicacheHttpApp } from "./src/features/replicache/replicache.http";
import { wsHandler } from "./src/features/websockets/websocket.handler";

// --- Layer Definitions ---
const mergedRpc = AuthRpc.merge(UserRpcs).merge(RpcLog);
const allRpcHandlers = {
  ...AuthRpcHandlers,
  ...RpcUserHandlers,
  ...RpcLogHandlers,
};
const AppServicesLive = Layer.mergeAll(
  DbLayer,
  CryptoLive,
  PokeServiceLive,
  S3UploaderLive,
).pipe(Layer.provide(ConfigLive));

const RpcHandlersLive = mergedRpc.toLayer(allRpcHandlers);
const AppAuthMiddlewareLive = AuthMiddlewareLive;
const RpcAppLayers = Layer.merge(RpcHandlersLive, AppAuthMiddlewareLive);

// --- Route and Handler Definitions ---

const rpcApp = Effect.flatten(
  RpcServer.toHttpApp(mergedRpc).pipe(Effect.provide(RpcAppLayers)),
);
const userHttpApp = UserHttpRoutes.pipe(HttpRouter.use(httpAuthMiddleware));

// --- Build the Full Application Router ---

const appRouter = HttpRouter.empty.pipe(
  HttpRouter.mountApp("/api/rpc", rpcApp),
  HttpRouter.mountApp("/api/user", userHttpApp),
  HttpRouter.mountApp("/api/replicache", replicacheHttpApp), // Refactored
  HttpRouter.get("/ws", wsHandler), // Refactored
);
// --- Create and Launch the Final Server ---

const program = HttpServer.serve(appRouter).pipe(
  Layer.provide(AppServicesLive),
  Layer.provide(RpcSerialization.layerJson),
  Layer.provide(BunHttpServer.layer({ port: 42069 })),
  Layer.provide(ObservabilityLive),
);
const runnable = Layer.launch(program);

BunRuntime.runMain(runnable);
