// FILE: ./bun-server.ts
import {
  HttpRouter,
  HttpServer,
  HttpMiddleware,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import {
  BunHttpServer,
  BunRuntime,
  BunFileSystem,
  BunPath,
} from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Effect, Layer } from "effect";
import * as Path from "@effect/platform/Path";

// Service and Config Layers
import { ObservabilityLive } from "./src/lib/server/observability";
import { DbLayer } from "./src/db/DbLayer";
import { AuthMiddlewareLive, httpAuthMiddleware } from "./src/lib/server/auth";
import { CryptoLive } from "./src/lib/server/crypto";
import { S3UploaderLive } from "./src/lib/server/s3";
import { ConfigLive } from "./src/lib/server/Config";
import { PokeServiceLive } from "./src/lib/server/PokeService";
import { JwtServiceLive } from "./src/lib/server/JwtService";

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

// --- THIS IS THE CORRECTED LAYER COMPOSITION ---

// Base services that depend on ConfigLive will now have it provided at the end.
const BaseServicesLive = Layer.mergeAll(
  DbLayer,
  CryptoLive,
  PokeServiceLive,
  S3UploaderLive,
  BunFileSystem.layer,
  BunPath.layer,
);

// AppServicesLive will now require Config, which is okay.
const AppServicesLive = Layer.provide(JwtServiceLive, BaseServicesLive).pipe(
  Layer.merge(BaseServicesLive),
);

// RpcHandlersAndMiddleware defines the layers that provide the RPC implementation.
const RpcHandlersLive = mergedRpc.toLayer(allRpcHandlers);
const AppAuthMiddlewareLive = AuthMiddlewareLive;
const RpcHandlersAndMiddleware = Layer.merge(
  RpcHandlersLive,
  AppAuthMiddlewareLive,
);

// Create a self-contained layer for the RPC app by providing its dependencies.
const RpcAppLayers = Layer.provide(RpcHandlersAndMiddleware, AppServicesLive);

// --- Route and Handler Definitions ---

// The rpcApp effect now has its dependencies fully satisfied.
const rpcApp = Effect.flatten(
  RpcServer.toHttpApp(mergedRpc).pipe(Effect.provide(RpcAppLayers)),
);
const userHttpApp = UserHttpRoutes.pipe(HttpRouter.use(httpAuthMiddleware));

// --- Static File Serving Handler ---
const staticHandler = Effect.gen(function* (_) {
  const path = yield* _(Path.Path);
  const req = yield* _(HttpServerRequest.HttpServerRequest);
  const urlPath = req.url;
  const clientBuildPath = "dist";

  // Determine if the request is likely for a static file asset (e.g., has a file extension).
  const isAssetRequest = urlPath.split("/").pop()!.includes(".");

  const filePath = path.join(
    clientBuildPath,
    // If it's the root path or any path without a file extension, default to index.html
    urlPath.endsWith("/") || !isAssetRequest ? "index.html" : urlPath,
  );

  return yield* _(
    HttpServerResponse.file(filePath),
    Effect.catchTag("SystemError", (e) => {
      // If a file is not found:
      if (e.reason === "NotFound") {
        // If it was an asset request (e.g., .js, .css), it should be a 404.
        // Otherwise, it's a client-side route (e.g., /notes/123), so serve the SPA's entry point.
        if (isAssetRequest) {
          return HttpServerResponse.empty({ status: 404 });
        } else {
          return HttpServerResponse.file(
            path.join(clientBuildPath, "index.html"),
          );
        }
      }
      // For other system errors, let the error bubble up.
      return Effect.fail(e);
    }),
  );
});
// --- Build the Full Application Router ---

const appRouter = HttpRouter.empty.pipe(
  HttpRouter.mountApp("/api/rpc", rpcApp),
  HttpRouter.mountApp("/api/user", userHttpApp),
  HttpRouter.mountApp("/api/replicache", replicacheHttpApp),
  HttpRouter.use(HttpMiddleware.cors()),
  HttpRouter.get("/ws", wsHandler),
  // Fallback to serving static files for any other GET request
  HttpRouter.get("/*", staticHandler),
);

// --- Create and Launch the Final Server ---

// ✅ FIX: Combine all application services that might depend on config.
const FullAppServicesLive = Layer.mergeAll(AppServicesLive, ObservabilityLive);

// ✅ FIX: Create a single, fully-resolved application layer.
// This layer defines the entire HTTP application and its dependencies.
const HttpApp = HttpServer.serve(appRouter).pipe(
  Layer.provide(FullAppServicesLive),
  Layer.provide(RpcSerialization.layerJson),
  Layer.provide(BunHttpServer.layer({ port: 42069 })),
);

// ✅ FIX: Provide the final configuration and then launch the self-contained app.
// This resolves the TS2769 error because the final effect has no unmet requirements.
const runnable = Layer.launch(HttpApp.pipe(Layer.provide(ConfigLive)));

BunRuntime.runMain(runnable);
