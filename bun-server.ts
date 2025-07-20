// FILE: ./bun-server.ts
import {
  HttpRouter,
  HttpServer,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { RpcSerialization, RpcServer } from "@effect/rpc";
import { Cause, Effect, Layer, Option, Stream, Schema } from "effect";
import { isParseError } from "effect/ParseResult";
import { type HttpBodyError } from "@effect/platform/HttpBody";

// Service and Config Layers
import { ObservabilityLive } from "./src/lib/server/observability";
import { DbLayer } from "./src/db/DbLayer";
import {
  AuthMiddlewareLive,
  httpAuthMiddleware,
  validateSessionEffect,
  AuthError,
} from "./src/lib/server/auth";
import { CryptoLive } from "./src/lib/server/crypto";
import { S3UploaderLive } from "./src/lib/server/s3";
import { ConfigLive } from "./src/lib/server/Config";
import { PokeService, PokeServiceLive } from "./src/lib/server/PokeService";

// RPC and Handler Imports
import { AuthRpc, RequestError } from "./src/lib/shared/api";
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
  PushRequestSchema,
  PullResponseSchema,
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

// --- Replicache Handlers - Business Logic Only ---

// These effects contain ONLY the core logic. They can fail with our defined errors.
const pullHandlerLogic = Effect.gen(function* () {
  const body = yield* HttpServerRequest.schemaBodyJson(PullRequestSchema);
  const result = yield* handlePull(body);
  return yield* HttpServerResponse.schemaJson(PullResponseSchema)(result);
});

const pushHandlerLogic = Effect.gen(function* () {
  const body = yield* HttpServerRequest.schemaBodyJson(PushRequestSchema);
  yield* handlePush(body);
  return HttpServerResponse.empty();
});

// --- FIX: Helper type guards for specific error types ---
function isHttpBodyError(u: unknown): u is HttpBodyError {
  return (
    typeof u === "object" &&
    u !== null &&
    "_tag" in u &&
    u._tag === "HttpBodyError"
  );
}

const AuthErrorTags = new Set([
  "Unauthorized",
  "Forbidden",
  "BadRequest",
  "EmailAlreadyExistsError",
  "InternalServerError",
]);
function isAuthError(e: unknown): e is AuthError {
  return (
    typeof e === "object" &&
    e !== null &&
    "_tag" in e &&
    typeof e._tag === "string" &&
    AuthErrorTags.has(e._tag) &&
    "message" in e
  );
}

// ✅ THIS IS THE "THIRD WAY" - A SINGLE, ROBUST ERROR HANDLER ✅
// This function takes an effect and handles all possible failure cases,
// turning them into successful HttpServerResponse effects.
// --- FIX: The error handler was refactored from a `switch` statement to a series
// of `if` checks with type guards. This allows TypeScript to correctly narrow the
// error types, resolving the compilation error with `RequestError` and also
// fixing a bug where not all `AuthError` tags were being handled.
const resolveHandlerErrors = <R,>(
  handlerEffect: Effect.Effect<
    HttpServerResponse.HttpServerResponse,
    unknown,
    R
  >,
) =>
  handlerEffect.pipe(
    Effect.matchEffect({
      // The success case is simple: the handler already produced a response.
      onSuccess: (response) => Effect.succeed(response),
      // The failure case now uses a chain of type guards for robust handling.
      onFailure: (error) => {
        if (isHttpBodyError(error)) {
          return Effect.logWarning("Bad request: HttpBodyError", {
            reason: error.reason,
          }).pipe(
            Effect.andThen(
              HttpServerResponse.json(
                { error: "Invalid request body or content type" },
                { status: 400 },
              ),
            ),
          );
        }

        if (Schema.is(RequestError)(error)) {
          // The `Schema.is` guard correctly types `error` as RequestError.
          return Effect.logError(
            "RequestError in replicache handler",
            error,
          ).pipe(
            Effect.andThen(
              HttpServerResponse.json(
                { error: "An unexpected request error occurred" },
                { status: 500 },
              ),
            ),
          );
        }

        if (isParseError(error)) {
          const message = error.toString();
          return Effect.logWarning("Bad request: schema validation failed", {
            error: message,
          }).pipe(
            Effect.andThen(
              HttpServerResponse.json(
                { error: "Invalid request body", details: message },
                { status: 400 },
              ),
            ),
          );
        }

        if (isAuthError(error)) {
          const status =
            error._tag === "Unauthorized"
              ? 401
              : error._tag === "Forbidden"
                ? 403
                : error._tag === "BadRequest" ||
                    error._tag === "EmailAlreadyExistsError"
                  ? 400
                  : 500; // Corresponds to "InternalServerError"
          return HttpServerResponse.json({ error: error.message }, { status });
        }

        // This is our final fallback for any truly unexpected error.
        return Effect.logError("Unhandled Replicache handler error", {
          error,
        }).pipe(
          Effect.andThen(
            HttpServerResponse.json(
              { error: "Internal Server Error" },
              { status: 500 },
            ),
          ),
        );
      },
    }),
  );

const replicacheHttpApp = HttpRouter.empty.pipe(
  // We compose the logic with the error handler right in the router definition.
  HttpRouter.post("/pull", resolveHandlerErrors(pullHandlerLogic)),
  HttpRouter.post("/push", resolveHandlerErrors(pushHandlerLogic)),
  HttpRouter.use(httpAuthMiddleware),
);

// --- WebSocket Handler ---
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
