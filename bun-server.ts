// bun-server.ts
import {
  HttpRouter,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Effect, Exit, Layer, Stream } from "effect";

// Service and Config Layers
import { ObservabilityLive } from "./src/lib/server/observability";
import { DbLayer } from "./src/db/DbLayer";
import { Db } from "./src/db/DbTag";
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

// --- Define Handler and Dependency Layers ---

const mergedRpc = AuthRpc.merge(UserRpcs).merge(RpcLog).merge(ReplicacheRpc);
const allRpcHandlers = {
  ...AuthRpcHandlers,
  ...RpcUserHandlers,
  ...RpcLogHandlers,
  ...ReplicacheHandlers,
};
const HandlerDependenciesLive = Layer.mergeAll(
  DbLayer,
  CryptoLive,
  PokeServiceLive,
);
const RpcHandlersProviderLive = mergedRpc
  .toLayer(allRpcHandlers)
  .pipe(Layer.provide(HandlerDependenciesLive));
const AppAuthMiddlewareLive = AuthMiddlewareLive.pipe(Layer.provide(DbLayer));
const rpcAppEffect = RpcServer.toHttpApp(mergedRpc);

// --- Create the Main Application Layer ---

const ApplicationLive = Layer.effectDiscard(
  Effect.gen(function* () {
    const router = yield* HttpRouter.Default;

    // --- RPC Routes ---
    const rpcHttpApp = yield* rpcAppEffect.pipe(
      Effect.provide(RpcHandlersProviderLive),
      Effect.provide(AppAuthMiddlewareLive),
      Effect.provide(RpcSerialization.layerNdjson),
    );
    yield* router.mountApp("/api/rpc", Effect.scoped(rpcHttpApp));

    // --- Protected User HTTP Routes ---
    const protectedUserHttpApp = UserHttpRoutes.pipe(
      HttpRouter.use(httpAuthMiddleware),
      Effect.provide(DbLayer),
      Effect.provide(S3UploaderLive),
      Effect.provide(ConfigLive),
    );
    yield* router.mountApp("/api/user", protectedUserHttpApp);

    // --- WebSocket "Poke" Endpoint ---

    // 1. Define the validation logic as a self-contained Effect.
    // This Effect will succeed with the data needed for the stream, or fail with an HttpServerResponse.
    const validationEffect = Effect.gen(function* () {
      const db = yield* Db;
      const pokeService = yield* PokeService;
      const req = yield* HttpServerRequest.HttpServerRequest;

      const sessionId = new URL(req.url).searchParams.get("sessionId");
      if (!sessionId) {
        return yield* Effect.fail(
          HttpServerResponse.text("No session ID", { status: 401 }),
        );
      }

      const validationResult = yield* Effect.exit(
        validateSessionEffect(sessionId).pipe(Effect.provideService(Db, db)),
      );

      if (Exit.isFailure(validationResult)) {
        return yield* Effect.fail(
          HttpServerResponse.text("Invalid session", { status: 401 }),
        );
      }

      const { user } = validationResult.value;
      if (!user) {
        return yield* Effect.fail(
          HttpServerResponse.text("Invalid session", { status: 401 }),
        );
      }

      yield* Effect.logInfo(
        `WebSocket connection established for user: ${user.id}`,
      );

      // On success, return the service and user needed by the main stream.
      return { pokeService, user };
    });

    // 2. Construct the final handler using the "Stream as a Handler" pattern.
    const wsHandler = Stream.fromEffect(validationEffect).pipe(
      // On successful validation, switch to the poke subscription stream.
      Stream.flatMap(({ pokeService, user }) => pokeService.subscribe(user.id)),
      // This is the magic function that tells the server to perform a WebSocket upgrade.
      Stream.pipeThroughChannel(HttpServerRequest.upgradeChannel()),
      // This consumes the stream and converts the entire pipeline into an Effect.
      Stream.runDrain,
      // When the stream completes (e.g., client disconnects), return an empty success response.
      Effect.as(HttpServerResponse.empty()),
      // Provide all dependencies needed for both validation and the stream itself.
      Effect.provide(DbLayer),
      Effect.provide(PokeServiceLive),
      // Catch any failures (like our validation responses) and return them as the final response.
      Effect.catchAll((error) => {
        if (HttpServerResponse.isServerResponse(error)) {
          return Effect.succeed(error);
        }
        return Effect.logError("Unhandled WS error", { error }).pipe(
          Effect.andThen(HttpServerResponse.empty({ status: 500 })),
        );
      }),
    );

    yield* router.get("/ws", wsHandler);
  }),
);

// --- Compose and Launch Final Server ---

const AppAndDependenciesLive = ApplicationLive.pipe(
  Layer.provide(HttpRouter.Default.Live),
  Layer.provide(ObservabilityLive),
);

const AppMain = HttpRouter.Default.serve().pipe(
  Layer.provide(AppAndDependenciesLive),
  Layer.provide(BunHttpServer.layer({ port: 42069 })),
);

const program = Layer.launch(AppMain).pipe(
  Effect.catchAllCause((cause) =>
    Effect.logFatal("Server failed to launch", cause),
  ),
);

const runnable = Effect.provide(program, Layer.scope);
BunRuntime.runMain(runnable);
