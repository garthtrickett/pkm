import {
  HttpRouter,
  HttpServer,
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
  BunFileSystem.layer, // Added for file system access
  BunPath.layer, // Added for path manipulation
).pipe(Layer.provide(ConfigLive));

const RpcHandlersLive = mergedRpc.toLayer(allRpcHandlers);
const AppAuthMiddlewareLive = AuthMiddlewareLive;
const RpcAppLayers = Layer.merge(RpcHandlersLive, AppAuthMiddlewareLive);

// --- Route and Handler Definitions ---

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
  HttpRouter.get("/ws", wsHandler),
  // Fallback to serving static files for any other GET request
  HttpRouter.get("/*", staticHandler),
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
