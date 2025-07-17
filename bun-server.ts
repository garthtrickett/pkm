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

    // ✅ THIS IS THE FIX: Explicitly get the service from the context first.
    const pokeService = yield* PokeService;

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
    const wsHandlerLogic = Effect.gen(function* () {
      const req = yield* HttpServerRequest.HttpServerRequest;
      const db = yield* Db;
      // This logic no longer needs to yield PokeService, as it will be provided below.
      const pokeSvc = yield* PokeService;

      const sessionId = new URL(req.url).searchParams.get("sessionId");
      if (!sessionId) {
        yield* Effect.logWarning("WebSocket rejected: No sessionId");
        return Effect.succeed(
          HttpServerResponse.text("No session ID", { status: 401 }),
        );
      }

      const validationResult = yield* Effect.exit(
        validateSessionEffect(sessionId).pipe(Effect.provideService(Db, db)),
      );
      if (Exit.isFailure(validationResult)) {
        yield* Effect.logWarning(
          "WebSocket rejected: Session validation failed.",
          validationResult.cause,
        );
        return Effect.succeed(
          HttpServerResponse.text("Invalid session", { status: 401 }),
        );
      }

      const { user } = validationResult.value;
      if (!user) {
        yield* Effect.logWarning(
          "WebSocket rejected: No valid user found for session.",
        );
        return Effect.succeed(
          HttpServerResponse.text("Invalid session", { status: 401 }),
        );
      }

      yield* Effect.logInfo(
        `WebSocket connection established for user: ${user.id}`,
      );
      return pokeSvc
        .subscribe(user.id)
        .pipe(
          Stream.pipeThroughChannel(HttpServerRequest.upgradeChannel()),
          Stream.runDrain,
          Effect.as(HttpServerResponse.empty()),
        );
    }).pipe(
      Effect.flatten,
      Effect.catchAll((error) =>
        Effect.logError("WebSocket handler failed unexpectedly", error).pipe(
          Effect.as(
            HttpServerResponse.empty({
              status: 500,
              statusText: "Internal Server Error",
            }),
          ),
        ),
      ),
    );

    // Provide the necessary dependencies to the handler before registering it.
    // ✅ THIS IS THE FIX: Provide the concrete service instance we retrieved earlier.
    const wsHandler = wsHandlerLogic.pipe(
      Effect.provide(DbLayer),
      Effect.provideService(PokeService, pokeService),
    );

    // This is now truly type-safe.
    yield* router.get("/ws", wsHandler);
  }),
);

// --- Compose and Launch Final Server ---

// Create a single layer that contains the application logic and all its dependencies.
const AppAndDependenciesLive = ApplicationLive.pipe(
  Layer.provide(HttpRouter.Default.Live),
  Layer.provide(PokeServiceLive),
  Layer.provide(ObservabilityLive),
);

// Create the final server layer, providing the complete app layer to it.
const AppMain = HttpRouter.Default.serve().pipe(
  Layer.provide(AppAndDependenciesLive),
  Layer.provide(BunHttpServer.layer({ port: 42069 })),
);

const program = Layer.launch(AppMain);
const runnable = Effect.provide(program, Layer.scope);
BunRuntime.runMain(runnable);
