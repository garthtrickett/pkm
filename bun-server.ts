// FILE: ./bun-server.ts
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
import { AuthRpc } from "./src/lib/shared/api";
import { UserRpcs } from "./src/user";
import { RpcLog } from "./src/lib/shared/log-schema";
import { AuthRpcHandlers } from "./src/features/auth/auth.handler";
import { RpcUserHandlers } from "./src/user";
import { RpcLogHandlers } from "./src/features/log/log.handler";
import { UserHttpRoutes } from "./src/features/user/user.http";
// ✅ ADD: Import Replicache handlers and schemas directly
import { handlePull } from "./src/features/replicache/pull";
import { handlePush } from "./src/features/replicache/push";
import {
  PullRequestSchema,
  PullResponseSchema,
  PushRequestSchema,
} from "./src/lib/shared/replicache-schemas";

// --- Layer Definitions ---
const mergedRpc = AuthRpc.merge(UserRpcs).merge(RpcLog);
const allRpcHandlers = {
  ...AuthRpcHandlers,
  ...RpcUserHandlers,
  ...RpcLogHandlers,
};

const s3LiveWithConfig = S3UploaderLive.pipe(Layer.provide(ConfigLive));
const AppServicesLive = Layer.mergeAll(
  DbLayer,
  CryptoLive,
  PokeServiceLive,
  s3LiveWithConfig,
);

const RpcHandlersLive = mergedRpc.toLayer(allRpcHandlers);
const AppAuthMiddlewareLive = AuthMiddlewareLive;
const RpcAppLayers = Layer.merge(RpcHandlersLive, AppAuthMiddlewareLive);

// --- Route and Handler Definitions ---

const rpcApp = Effect.flatten(
  RpcServer.toHttpApp(mergedRpc).pipe(Effect.provide(RpcAppLayers)),
);

const userHttpApp = UserHttpRoutes.pipe(HttpRouter.use(httpAuthMiddleware));

// ✅ ADD: A new, dedicated HTTP router for Replicache endpoints
const replicacheHttpApp = HttpRouter.empty.pipe(
  HttpRouter.post(
    "/pull",
    Effect.gen(function* () {
      // ✅ FIX: `schemaBodyJson` is a static method on the module.
      // It returns an Effect that accesses the request from the context.
      const body = yield* HttpServerRequest.schemaBodyJson(PullRequestSchema);
      const response = yield* handlePull(body);
      return yield* HttpServerResponse.schemaJson(PullResponseSchema)(response);
    }),
  ),
  HttpRouter.post(
    "/push",
    Effect.gen(function* () {
      // ✅ FIX: Same correction as above.
      const body = yield* HttpServerRequest.schemaBodyJson(PushRequestSchema);
      yield* handlePush(body); // This effect returns void on success
      return HttpServerResponse.empty(); // Return a 200 OK with no body
    }),
  ),
  // All Replicache endpoints must be authenticated
  HttpRouter.use(httpAuthMiddleware),
);

const wsHandler = Stream.fromEffect(
  Effect.gen(function* () {
    const pokeService = yield* PokeService;
    const req = yield* HttpServerRequest.HttpServerRequest;
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const sessionId = url.searchParams.get("sessionId");
    if (!sessionId) {
      return yield* Effect.fail(
        HttpServerResponse.text("No session ID", { status: 401 }),
      );
    }
    const { user } = yield* validateSessionEffect(sessionId);
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
  Effect.catchAllCause((cause) => {
    const failure = Cause.failureOption(cause);
    if (
      Option.isSome(failure) &&
      HttpServerResponse.isServerResponse(failure.value)
    ) {
      return Effect.succeed(failure.value);
    }
    return Effect.logError(
      "Unhandled WebSocket handler error.",
      Cause.pretty(cause),
    ).pipe(Effect.andThen(HttpServerResponse.empty({ status: 500 })));
  }),
);

// --- Build the Full Application Router ---

const appRouter = HttpRouter.empty.pipe(
  HttpRouter.mountApp("/api/rpc", rpcApp),
  HttpRouter.mountApp("/api/user", userHttpApp),
  HttpRouter.mountApp("/api/replicache", replicacheHttpApp), // ✅ Mount the new router
  HttpRouter.get("/ws", wsHandler),
);

// --- Create and Launch the Final Server ---

const ServerLive = HttpServer.serve(appRouter).pipe(
  Layer.provide(AppServicesLive),
  Layer.provide(RpcSerialization.layerJson),
  Layer.provide(BunHttpServer.layer({ port: 42069 })),
);

const program = ServerLive.pipe(Layer.provide(ObservabilityLive));

const runnable = Layer.launch(program).pipe(
  Effect.catchAllCause((cause) =>
    Effect.logFatal("Server failed to launch", cause),
  ),
);

BunRuntime.runMain(runnable);
