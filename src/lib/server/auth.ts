// src/lib/server/auth.ts
import { Effect, Layer, Option, Schema, Metric } from "effect";
import { Db } from "../../db/DbTag";
import { Crypto } from "./crypto";
import { generateId } from "./utils";
import { createDate, TimeSpan } from "oslo";
import { AuthDatabaseError } from "../../features/auth/Errors";
import { UserSchema, type User } from "../shared/schemas";
import type { Session, SessionId } from "../../types/generated/public/Session";
import type { UserId } from "../../types/generated/public/User";
// ✅ 1. CORRECTED: Import `HttpMiddleware` directly instead of the `Http` namespace.
import {
  HttpMiddleware,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import type { Headers } from "@effect/platform/Headers";
import { Auth, AuthMiddleware, AuthError } from "../shared/auth";
import { sessionValidationSuccessCounter } from "./metrics";

// Re-export for convenience in other server files
export { Auth, AuthError, AuthMiddleware };

// --- LIVE IMPLEMENTATION ---
export const AuthMiddlewareLive = Layer.effect(
  AuthMiddleware,
  Effect.gen(function* () {
    const db = yield* Db;
    const validate = (sessionId: string) =>
      validateSessionEffect(sessionId).pipe(Effect.provideService(Db, db));

    return ({ headers, clientId, rpc }) => {
      const logic = Effect.gen(function* () {
        const rpcTag = rpc._tag;
        yield* Effect.logDebug(
          { clientId, rpc: rpcTag },
          "AuthMiddleware triggered",
        );

        const sessionIdOption = getSessionIdFromRequest({ headers });

        if (Option.isNone(sessionIdOption)) {
          return yield* Effect.fail(
            new AuthError({
              _tag: "Unauthorized",
              message: "No session cookie provided",
            }),
          );
        }

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

        yield* Effect.logInfo(
          { clientId, userId: user.id, rpc: rpcTag },
          "Session validated successfully. Providing Auth service.",
        );
        return { user, session };
      });

      return logic;
    };
  }),
);

// --- HTTP-SPECIFIC MIDDLEWARE ---
/**
 * A proper HTTP middleware for authenticating requests.
 * This is distinct from the RPC-specific middleware. It checks for a session cookie,
 * validates it, and provides the `Auth` service to the HTTP handler's context.
 * It has a `Db` requirement and can fail with an `HttpServerResponse`.
 */
// ✅ 2. CORRECTED: Use `HttpMiddleware.make` instead of `Http.middleware.make`.
export const httpAuthMiddleware = HttpMiddleware.make((app) =>
  Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest;

    // Reuse the same logic for getting the session ID
    const sessionIdOption = getSessionIdFromRequest({
      headers: request.headers,
    });

    if (Option.isNone(sessionIdOption)) {
      yield* Effect.logWarning(
        "HTTP Auth Middleware: No session cookie provided.",
      );
      // Fail with an HTTP response to short-circuit the request
      return yield* Effect.fail(
        HttpServerResponse.json({ error: "Unauthorized" }, { status: 401 }),
      );
    }

    // This middleware will have a `Db` dependency, which will be provided by the Layer using it.
    const validationResult = yield* validateSessionEffect(
      sessionIdOption.value,
    );

    if (!validationResult.user || !validationResult.session) {
      yield* Effect.logWarning(
        "HTTP Auth Middleware: Invalid or expired session.",
      );
      // Also fail with an HTTP response
      return yield* Effect.fail(
        HttpServerResponse.json(
          { error: "Unauthorized" },
          {
            status: 401,
            // Include a header to clear the invalid cookie on the client
            headers: {
              "Set-Cookie":
                "session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
            },
          },
        ),
      );
    }

    yield* Metric.increment(sessionValidationSuccessCounter);
    yield* Effect.logInfo(
      { userId: validationResult.user.id },
      "HTTP Auth Middleware: Session validated successfully.",
    );

    // Create an instance of the Auth service
    const authService = Auth.of({
      user: validationResult.user,
      session: validationResult.session,
    });

    // Provide the Auth service to the next handler in the chain (`app`)
    return yield* Effect.provideService(app, Auth, authService);
  }),
);

/* ───────────────────────────────── Helper functions ───────────────────────────────── */
export const getSessionIdFromRequest = (req: {
  headers: Headers;
}): Option.Option<string> =>
  Option.fromNullable(req.headers["cookie"]).pipe(
    Option.map((cookieHeader) => cookieHeader.split("; ")),
    Option.flatMap((cookies) =>
      Option.fromNullable(cookies.find((c) => c.startsWith("session_id="))),
    ),
    Option.flatMap((cookie) => Option.fromNullable(cookie.split("=")[1])),
  );

export const createSessionEffect = (
  userId: UserId,
): Effect.Effect<string, AuthDatabaseError, Db | Crypto> =>
  Effect.gen(function* () {
    const db = yield* Db;
    const sessionId = yield* generateId(40);
    const expiresAt = createDate(new TimeSpan(30, "d"));

    yield* Effect.promise(() =>
      db
        .insertInto("session")
        .values({
          id: sessionId as SessionId,
          user_id: userId,
          expires_at: expiresAt,
        })
        .execute(),
    ).pipe(Effect.mapError((cause) => new AuthDatabaseError({ cause })));

    return sessionId;
  });

export const deleteSessionEffect = (
  sessionId: string,
): Effect.Effect<void, AuthDatabaseError, Db> =>
  Effect.gen(function* () {
    const db = yield* Db;
    yield* Effect.promise(() =>
      db
        .deleteFrom("session")
        .where("id", "=", sessionId as SessionId)
        .execute(),
    ).pipe(
      Effect.mapError((cause) => new AuthDatabaseError({ cause })),
      Effect.asVoid,
    );
  });

export const validateSessionEffect = (
  sessionId: string,
): Effect.Effect<
  { user: User | null; session: Session | null },
  AuthDatabaseError,
  Db
> =>
  Effect.gen(function* () {
    const db = yield* Db;
    const session = yield* Effect.promise(() =>
      db
        .selectFrom("session")
        .selectAll()
        .where("id", "=", sessionId as SessionId)
        .executeTakeFirst(),
    ).pipe(Effect.mapError((cause) => new AuthDatabaseError({ cause })));

    if (!session) {
      return { user: null, session: null };
    }

    if (session.expires_at < new Date()) {
      yield* Effect.fork(deleteSessionEffect(sessionId));
      return { user: null, session: null };
    }

    const maybeRawUser = yield* Effect.promise(() =>
      db
        .selectFrom("user")
        .selectAll()
        .where("id", "=", session.user_id)
        .executeTakeFirst(),
    ).pipe(Effect.mapError((cause) => new AuthDatabaseError({ cause })));

    const user = Option.getOrNull(
      Schema.decodeUnknownOption(UserSchema)(maybeRawUser),
    );
    return { user, session };
  });
