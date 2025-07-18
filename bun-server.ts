// in  // FILE: ./bun-server.ts
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

// --- Replicache Handlers (defined explicitly) ---

const pullHandler = Effect.gen(function* () {
  // 1. Validate request body against the schema
  const body = yield* HttpServerRequest.schemaBodyJson(PullRequestSchema).pipe(
    Effect.catchAll((error) =>
      Effect.logWarning("Bad request: pull schema validation failed", {
        error,
      }).pipe(
        Effect.andThen(
          HttpServerResponse.json(
            { message: "Invalid request body" },
            { status: 400 },
          ),
        ),
        Effect.flatMap((response) => Effect.fail(response)),
      ),
    ),
  );

  // 2. Execute the core logic
  const result = yield* handlePull(body);

  // 3. Validate and serialize the successful response
  return yield* HttpServerResponse.schemaJson(PullResponseSchema)(result).pipe(
    Effect.catchAll((error) =>
      Effect.logError(
        "CRITICAL: Pull handler produced data that failed its own response schema validation.",
        { error },
      ).pipe(
        Effect.map(() =>
          HttpServerResponse.unsafeJson(
            { message: "Internal Server Error: response serialization failed" },
            { status: 500 },
          ),
        ),
      ),
    ),
  );
}).pipe(
  // 4. Catch any failures from the pipeline (e.g., from logic or validation)
  Effect.catchAll((error) => {
    // If the error is already a response (like our 400), return it directly
    if (HttpServerResponse.isServerResponse(error)) {
      return Effect.succeed(error);
    }
    // Otherwise, log the unexpected error and return a 500
    return Effect.logError("Error in pull handler logic", { error }).pipe(
      Effect.andThen(
        HttpServerResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        ),
      ),
    );
  }),
);

const pushHandler = Effect.gen(function* () {
  // 1. Validate request body against the schema
  const body = yield* HttpServerRequest.schemaBodyJson(PushRequestSchema).pipe(
    Effect.catchAll((error) =>
      Effect.logWarning("Bad request: push schema validation failed", {
        error,
      }).pipe(
        Effect.andThen(
          HttpServerResponse.json(
            { message: "Invalid request body" },
            { status: 400 },
          ),
        ),
        Effect.flatMap((response) => Effect.fail(response)),
      ),
    ),
  );

  // 2. Execute the core logic, providing its specific dependencies inline
  yield* handlePush(body).pipe(Effect.provide(AppServicesLive));

  // 3. Return an empty JSON object for a successful response
  return HttpServerResponse.unsafeJson({});
}).pipe(
  // 4. Catch any failures from the pipeline
  Effect.catchAll((error) => {
    // If the error is already a response, return it directly
    if (HttpServerResponse.isServerResponse(error)) {
      return Effect.succeed(error);
    }
    // Otherwise, log the unexpected error and return a 500
    return Effect.logError("Error in push handler logic", { error }).pipe(
      Effect.andThen(
        HttpServerResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        ),
      ),
    );
  }),
);

// The router definition logic remains sound. Handlers can have requirements
// that are satisfied later when the server is built.
const replicacheHttpApp = HttpRouter.empty.pipe(
  HttpRouter.post("/pull", pullHandler),
  HttpRouter.post("/push", pushHandler),
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
  HttpRouter.mountApp("/api/replicache", replicacheHttpApp),
  HttpRouter.get("/ws", wsHandler),
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
