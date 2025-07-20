// FILE: src/features/replicache/replicache.http.ts
import {
  HttpRouter,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import { type HttpBodyError } from "@effect/platform/HttpBody";
import { Effect, Schema } from "effect";
import { isParseError } from "effect/ParseResult";

import { AuthError, httpAuthMiddleware } from "../../lib/server/auth";
import { RequestError } from "../../lib/shared/api";
import {
  PullRequestSchema,
  PullResponseSchema,
  PushRequestSchema,
} from "../../lib/shared/replicache-schemas";
import { handlePull } from "./pull";
import { handlePush } from "./push";

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

// --- Helper type guards for specific error types ---
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

// A single, robust error handler for Replicache endpoints
const resolveHandlerErrors = <R,>(
  handlerEffect: Effect.Effect<
    HttpServerResponse.HttpServerResponse,
    unknown,
    R
  >,
) =>
  handlerEffect.pipe(
    Effect.matchEffect({
      onSuccess: (response) => Effect.succeed(response),
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

export const replicacheHttpApp = HttpRouter.empty.pipe(
  HttpRouter.post("/pull", resolveHandlerErrors(pullHandlerLogic)),
  HttpRouter.post("/push", resolveHandlerErrors(pushHandlerLogic)),
  HttpRouter.use(httpAuthMiddleware),
);
