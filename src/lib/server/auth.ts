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

        // --- 🪵 EXHAUSTIVE LOG: Log all incoming headers ---
        // We use JSON stringify/parse to get a clean, loggable object.
        const allHeaders = JSON.parse(JSON.stringify(headers));
        yield* Effect.logDebug(
          {
            clientId,
            rpc: rpcTag,
            headers: allHeaders,
          },
          "[AuthMiddleware] Raw incoming headers",
        );
        // ---

        const sessionIdOption = getSessionIdFromRequest({ headers });

        // --- 🪵 EXHAUSTIVE LOG: Log cookie parsing result ---
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
        // ---

        if (Option.isNone(sessionIdOption)) {
          // --- 🪵 EXHAUSTIVE LOG: Log failure reason ---
          yield* Effect.logWarning(
            { clientId, rpc: rpcTag },
            "[AuthMiddleware] FAILURE: No session cookie found in headers. Failing request.",
          );
          // ---
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
          // --- 🪵 EXHAUSTIVE LOG: Log validation failure ---
          yield* Effect.logWarning(
            { clientId, rpc: rpcTag, sessionId: sessionIdOption.value },
            "[AuthMiddleware] FAILURE: Session ID was present but failed validation (invalid or expired). Failing request.",
          );
          // ---
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
          "[AuthMiddleware] SUCCESS: Session validated successfully. Providing Auth service to handler.",
        );
        return { user, session };
      });

      return logic;
    };
  }),
);

// --- HTTP-SPECIFIC MIDDLEWARE (with added logging for completeness) ---
export const httpAuthMiddleware = HttpMiddleware.make((app) =>
  Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest;
    const allHeaders = JSON.parse(JSON.stringify(request.headers));
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
    yield* Effect.logInfo(
      { userId: validationResult.user.id, url: request.url },
      "[httpAuthMiddleware] SUCCESS: Session validated successfully.",
    );

    const authService = Auth.of({
      user: validationResult.user,
      session: validationResult.session,
    });
    return yield* Effect.provideService(app, Auth, authService);
  }),
);

// ... (rest of the file is unchanged)
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
