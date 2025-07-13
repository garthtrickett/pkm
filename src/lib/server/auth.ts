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
import { Headers } from "@effect/platform/Headers";
import { Auth, AuthMiddleware, AuthError } from "../shared/auth";
import { sessionValidationSuccessCounter } from "./metrics";

// Re-export for convenience in other server files
export { Auth, AuthError, AuthMiddleware };

// --- LIVE IMPLEMENTATION ---
export const AuthMiddlewareLive = Layer.effect(
  AuthMiddleware,
  Effect.gen(function* () {
    const db = yield* Db;

    return ({ headers, clientId, rpc }) => {
      const logic = Effect.gen(function* () {
        const rpcTag = rpc._tag;
        yield* Effect.logDebug(
          { clientId, rpc: rpcTag },
          "AuthMiddleware triggered",
        );
        const sessionIdOption = getSessionIdFromRequest({ headers });

        if (Option.isNone(sessionIdOption)) {
          yield* Effect.logDebug(
            { clientId, rpc: rpcTag },
            "No session cookie found, failing middleware.",
          );
          return yield* Effect.fail(
            new AuthError({
              _tag: "Unauthorized",
              message: "No session cookie provided",
            }),
          );
        }

        const sessionId = sessionIdOption.value;
        yield* Effect.logDebug(
          { clientId, rpc: rpcTag },
          "Session cookie found, validating.",
        );

        const { user, session } = yield* validateSessionEffect(sessionId);

        if (!user || !session) {
          yield* Effect.logWarning(
            { clientId, rpc: rpcTag },
            "Session validation failed (invalid/expired), failing middleware.",
          );
          return yield* Effect.fail(
            new AuthError({
              _tag: "Unauthorized",
              message: "Invalid or expired session",
            }),
          );
        }

        // Increment our counter every time a session is successfully validated.
        yield* Metric.increment(sessionValidationSuccessCounter);

        yield* Effect.logInfo(
          { clientId, userId: user.id, rpc: rpcTag },
          "Session validated successfully. Providing Auth service.",
        );
        return { user, session };
      });

      return logic.pipe(
        Effect.catchAll((err) =>
          err instanceof AuthDatabaseError ?
            Effect.logError(
              "Internal database error during session validation.",
              err,
            ).pipe(
              Effect.andThen(
                Effect.fail(
                  new AuthError({
                    _tag: "InternalServerError",
                    message: "An internal error occurred during authentication.",
                  }),
                ),
              ),
              Effect.annotateLogs({ clientId, rpc: rpc._tag }),
            ) :
            Effect.fail(err)
        ),
        Effect.provideService(Db, db),
      );
    };
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

    yield* Effect.logInfo({ userId }, "Creating new session in database");

    yield* Effect.tryPromise({
      try: () =>
        db
          .insertInto("session")
          .values({
            id: sessionId as SessionId,
            user_id: userId,
            expires_at: expiresAt,
          })
          .execute(),
      catch: (cause) => new AuthDatabaseError({ cause }),
    }).pipe(
      Effect.withSpan("db.createSession", {
        attributes: { "db.system": "postgresql", "db.table": "session" },
      }),
    );

    return sessionId;
  });

export const deleteSessionEffect = (
  sessionId: string,
): Effect.Effect<void, AuthDatabaseError, Db> =>
  Effect.gen(function* () {
    const db = yield* Db;
    yield* Effect.logInfo({ sessionId }, "Attempting to delete session from DB");
    yield* Effect.tryPromise({
      try: () =>
        db
          .deleteFrom("session")
          .where("id", "=", sessionId as SessionId)
          .execute(),
      catch: (cause) => new AuthDatabaseError({ cause }),
    });
    yield* Effect.logInfo(
      { sessionId },
      "DB operation to delete session completed",
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
    const sessionOption = yield* Effect.tryPromise({
      try: () =>
        db
          .selectFrom("session")
          .selectAll()
          .where("id", "=", sessionId as SessionId)
          .executeTakeFirst(),
      catch: (cause) => new AuthDatabaseError({ cause }),
    }).pipe(Effect.map(Option.fromNullable));

    if (Option.isNone(sessionOption)) {
      return { user: null, session: null };
    }

    const session = sessionOption.value;
    if (session.expires_at < new Date()) {
      yield* deleteSessionEffect(sessionId);
      return { user: null, session: null };
    }

    const maybeRawUser = yield* Effect.tryPromise({
      try: () =>
        db
          .selectFrom("user")
          .selectAll()
          .where("id", "=", session.user_id)
          .executeTakeFirst(),
      catch: (cause) => new AuthDatabaseError({ cause }),
    });

    const user = Option.getOrNull(
      Schema.decodeUnknownOption(UserSchema)(maybeRawUser),
    );
    return { user, session };
  });
