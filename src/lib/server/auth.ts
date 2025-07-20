// src/lib/server/auth.ts
import {
  HttpMiddleware,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import { Effect, Layer, Metric, Option } from "effect";
import { Db } from "../../db/DbTag";
import type { Session } from "../../types/generated/public/Session";
import { Auth, AuthError, AuthMiddleware } from "../shared/auth";
import type { User } from "../shared/schemas";
import { sessionValidationSuccessCounter } from "./metrics";
// ✅ IMPORT: Import the session logic from the new service file.
import {
  getSessionIdFromRequest,
  validateSessionEffect,
} from "./session.service";

// Re-export for convenience in other server files
export { Auth, AuthMiddleware, AuthError };

// --- LIVE IMPLEMENTATION ---
export const AuthMiddlewareLive = Layer.effect(
  AuthMiddleware,
  Effect.gen(function* () {
    const db = yield* Db;
    const validate = (sessionId: string) =>
      validateSessionEffect(sessionId).pipe(Effect.provideService(Db, db));

    return ({ clientId, rpc }) => {
      const logic = Effect.gen(function* () {
        const rpcTag = rpc._tag;
        yield* Effect.logDebug(
          { clientId, rpc: rpcTag },
          "AuthMiddleware triggered",
        );

        const request = yield* HttpServerRequest.HttpServerRequest;
        const headers = request.headers;

        // ✅ FIX: Use a type assertion to safely handle the 'any' from JSON.parse
        const allHeaders = JSON.parse(JSON.stringify(headers)) as Record<
          string,
          string
        >;

        yield* Effect.logDebug(
          {
            clientId,
            rpc: rpcTag,
            headers: allHeaders,
          },
          "[AuthMiddleware] Raw incoming headers from context",
        );

        const sessionIdOption = getSessionIdFromRequest({ headers });

        yield* Effect.logDebug(
          {
            clientId,
            rpc: rpcTag,
            cookieHeader: allHeaders.cookie,
            foundSessionId: Option.isSome(sessionIdOption),
            sessionIdValue: Option.getOrNull(sessionIdOption),
          },
          "[AuthMiddleware] Result of getSessionIdFromRequest",
        );

        if (Option.isNone(sessionIdOption)) {
          return yield* Effect.fail(
            new AuthError({
              _tag: "Unauthorized",
              message: "No session cookie provided",
            }),
          );
        }

        yield* Effect.logDebug(
          { sessionId: sessionIdOption.value },
          "[AuthMiddleware] Session ID found, proceeding to validation.",
        );
        const { user, session } = yield* validate(sessionIdOption.value);

        if (!user || !session) {
          return yield* Effect.fail(
            new AuthError({
              _tag: "Unauthorized",
              message: "Invalid or expired session",
            }),
          );
        }

        yield* Metric.increment(sessionValidationSuccessCounter);
        // yield* Effect.logInfo(
        //   { clientId, userId: user.id, rpc: rpcTag },
        //   "[AuthMiddleware] SUCCESS: Session validated successfully. Providing Auth service to handler.",
        // );
        return { user, session };
      });

      // This cast is safe because the RpcServer's HTTP adapter runs this middleware
      // within a context that already provides HttpServerRequest.
      return logic as Effect.Effect<
        { user: User; session: Session },
        AuthError,
        never
      >;
    };
  }),
);

// --- HTTP-SPECIFIC MIDDLEWARE ---
export const httpAuthMiddleware = HttpMiddleware.make((app) =>
  Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest;

    // ✅ FIX: Use a type assertion to safely handle the 'any' from JSON.parse
    const allHeaders = JSON.parse(JSON.stringify(request.headers)) as Record<
      string,
      string
    >;

    yield* Effect.logDebug(
      { url: request.url, headers: allHeaders },
      "[httpAuthMiddleware] Triggered for HTTP request",
    );

    const sessionIdOption = getSessionIdFromRequest({
      headers: request.headers,
    });

    if (Option.isNone(sessionIdOption)) {
      yield* Effect.logWarning(
        "[httpAuthMiddleware] FAILURE: No session cookie provided.",
      );
      return yield* Effect.fail(
        HttpServerResponse.json({ error: "Unauthorized" }, { status: 401 }),
      );
    }

    const validationResult = yield* validateSessionEffect(
      sessionIdOption.value,
    );

    if (!validationResult.user || !validationResult.session) {
      yield* Effect.logWarning(
        "[httpAuthMiddleware] FAILURE: Invalid or expired session.",
      );
      return yield* Effect.fail(
        HttpServerResponse.json(
          { error: "Unauthorized" },
          {
            status: 401,
            headers: {
              "Set-Cookie":
                "session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
            },
          },
        ),
      );
    }

    yield* Metric.increment(sessionValidationSuccessCounter);
    // yield* Effect.logInfo(
    //   { userId: validationResult.user.id, url: request.url },
    //   "[httpAuthMiddleware] SUCCESS: Session validated successfully.",
    // );
    const authService = Auth.of({
      user: validationResult.user,
      session: validationResult.session,
    });
    return yield* Effect.provideService(app, Auth, authService);
  }),
);
