// bun-server.ts
import {
  HttpRouter,
  HttpServer,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Cause, Effect, Layer, Option, Stream } from "effect";

// Service and Config Layers
import { ObservabilityLive } from "./src/lib/server/observability";
import { DbLayer } from "./src/db/DbLayer";
import {
  AuthMiddlewareLive,
  httpAuthMiddleware,
  validateSessionEffect,
} from "./src/lib/server/auth";
import { CryptoLive } from "./src/lib/server/crypto";
import { S3UploaderLive } from "./src/lib/server/s3";
import { ConfigLive } from "./src/lib/server/Config";
import { PokeService, PokeServiceLive } from "./src/lib/server/PokeService";

// RPC and Handler Imports
import { AuthRpc, ReplicacheRpc } from "./src/lib/shared/api";
import { UserRpcs } from "./src/user";
import { RpcLog } from "./src/lib/shared/log-schema";
import { AuthRpcHandlers } from "./src/features/auth/auth.handler";
import { RpcUserHandlers } from "./src/user";
import { ReplicacheHandlers } from "./src/features/replicache/replicache.handler";
import { RpcLogHandlers } from "./src/features/log/log.handler";
import { UserHttpRoutes } from "./src/features/user/user.http";

// --- Layer Definitions ---

const mergedRpc = AuthRpc.merge(UserRpcs).merge(RpcLog).merge(ReplicacheRpc);
const allRpcHandlers = {
  ...AuthRpcHandlers,
  ...RpcUserHandlers,
  ...RpcLogHandlers,
  ...ReplicacheHandlers,
};

// The S3UploaderLive layer requires the Config service. We must
// provide ConfigLive to it before merging it with other services.
const s3LiveWithConfig = S3UploaderLive.pipe(Layer.provide(ConfigLive));

// Now, we can merge all the application services. The result is a single
// layer that has no outstanding requirements.
const AppServicesLive = Layer.mergeAll(
  DbLayer,
  CryptoLive,
  PokeServiceLive,
  s3LiveWithConfig, // Use the version that has its Config dependency satisfied
);

const RpcHandlersLive = mergedRpc.toLayer(allRpcHandlers);
const AppAuthMiddlewareLive = AuthMiddlewareLive;
const RpcAppLayers = Layer.merge(RpcHandlersLive, AppAuthMiddlewareLive);

// --- Route and Handler Definitions ---

const rpcApp = Effect.flatten(
  RpcServer.toHttpApp(mergedRpc).pipe(Effect.provide(RpcAppLayers)),
);

const userHttpApp = UserHttpRoutes.pipe(HttpRouter.use(httpAuthMiddleware));

const wsHandler = Stream.fromEffect(
  Effect.gen(function* () {
    const pokeService = yield* PokeService;
    const req = yield* HttpServerRequest.HttpServerRequest;

    // ✅ FIX: The `URL` constructor needs a base. The `req.url` is only a path.
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const sessionId = url.searchParams.get("sessionId");

    if (!sessionId) {
      return yield* Effect.fail(
        HttpServerResponse.text("No session ID", { status: 401 }),
      );
    }
    // `validateSessionEffect` returns null if the session is invalid, it doesn't fail.
    const { user } = yield* validateSessionEffect(sessionId);

    // We must check if the user was found.
    if (!user) {
      return yield* Effect.fail(
        HttpServerResponse.text("Invalid session", { status: 401 }),
      );
    }

    yield* Effect.logInfo(
      `WebSocket connection established for user: ${user.id}`,
    );
    return { pokeService, user };
  }),
).pipe(
  Stream.flatMap(({ pokeService, user }) => pokeService.subscribe(user.id)),
  Stream.pipeThroughChannel(HttpServerRequest.upgradeChannel()),
  Stream.runDrain,
  Effect.as(HttpServerResponse.empty()),
  // This catch is still valuable for any other potential errors.
  Effect.catchAllCause((cause) => {
    const failure = Cause.failureOption(cause);
    if (
      Option.isSome(failure) &&
      HttpServerResponse.isServerResponse(failure.value)
    ) {
      return Effect.succeed(failure.value);
    }
    return Effect.logError(
      "Unhandled WebSocket handler error. This is likely why the connection is closing.",
      {
        cause: Cause.pretty(cause),
      },
    ).pipe(Effect.andThen(HttpServerResponse.empty({ status: 500 })));
  }),
);

// --- Build the Full Application Router ---

const appRouter = HttpRouter.empty.pipe(
  HttpRouter.mountApp("/api/rpc", rpcApp),
  HttpRouter.mountApp("/api/user", userHttpApp),
  HttpRouter.get("/ws", wsHandler),
);

// --- Create and Launch the Final Server ---

// The HttpServer.serve function returns a Layer. We compose it with
// other layers using `Layer.provide`.
const ServerLive = HttpServer.serve(appRouter).pipe(
  Layer.provide(AppServicesLive),
  Layer.provide(RpcSerialization.layerNdjson),
  Layer.provide(BunHttpServer.layer({ port: 42069 })),
);

// The final program is a layer that includes the server and observability.
const program = ServerLive.pipe(Layer.provide(ObservabilityLive));

// We use Layer.launch to build and run the final composed layer.
const runnable = Layer.launch(program).pipe(
  Effect.catchAllCause((cause) =>
    Effect.logFatal("Server failed to launch", cause),
  ),
);

BunRuntime.runMain(runnable);
