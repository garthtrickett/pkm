// src/lib/server/auth.ts
import {  Effect, Layer, Option, Schema } from "effect";
import { serverLog, Logger } from "./logger.server";
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

// Re-export for convenience in other server files
export { Auth, AuthError, AuthMiddleware };

// --- LIVE IMPLEMENTATION ---
export const AuthMiddlewareLive = Layer.effect(
  AuthMiddleware,
  Effect.gen(function* () {
    const db = yield* Db;
    const logger = yield* Logger;

    return ({ headers, clientId, rpc }) => {
      const logic = Effect.gen(function* () {
        yield* serverLog(
          "debug",
          { clientId, rpc: rpc._tag },
          "AuthMiddleware triggered",
        );
        const sessionIdOption = getSessionIdFromRequest({ headers });

        if (Option.isNone(sessionIdOption)) {
          yield* serverLog(
            "debug",
            { clientId, rpc: rpc._tag },
            "No session cookie found, failing middleware.",
          );

          // ✅ ADDED THIS LOG FOR EMPHASIS
          yield* serverLog(
            "warn",
            { clientId, rpc: rpc._tag },
            "AuthMiddleware FINAL DECISION: Failing with Unauthorized (No Session).",
          );

          return yield* Effect.fail(
            new AuthError({
              _tag: "Unauthorized",
              message: "No session cookie provided",
            }),
          );
        }

        const sessionId = sessionIdOption.value;
        yield* serverLog(
          "debug",
          { clientId, sessionId, rpc: rpc._tag },
          "Session cookie found, validating.",
        );

        const { user, session } = yield* validateSessionEffect(sessionId);

        if (!user || !session) {
          yield* serverLog(
            "warn",
            { clientId, sessionId, rpc: rpc._tag },
            "Session validation failed (invalid/expired), failing middleware.",
          );
          return yield* Effect.fail(
            new AuthError({
              _tag: "Unauthorized",
              message: "Invalid or expired session",
            }),
          );
        }

        yield* serverLog(
          "info",
          { clientId, userId: user.id, rpc: rpc._tag },
          "Session validated successfully. Providing Auth service.",
        );
        return { user, session };
      });

      return logic.pipe(
        Effect.catchAll((err) =>
          err instanceof AuthDatabaseError ?
            serverLog(
              "error",
              { error: err, clientId, rpc: rpc._tag },
              "Internal database error during session validation.",
            ).pipe(
              Effect.andThen(
                Effect.fail(
                  new AuthError({
                    _tag: "InternalServerError",
                    message: "An internal error occurred during authentication.",
                  }),
                ),
              ),
            ) :
            Effect.fail(err)
        ),
        Effect.provideService(Db, db),
        Effect.provideService(Logger, logger),
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
    });
    return sessionId;
  });

export const deleteSessionEffect = (
  sessionId: string,
): Effect.Effect<void, AuthDatabaseError, Db | Logger> =>
  Effect.gen(function* () {
    const db = yield* Db;
    yield* serverLog(
      "info",
      { sessionId },
      "Attempting to delete session from DB",
    );
    yield* Effect.tryPromise({
      try: () =>
        db
          .deleteFrom("session")
          .where("id", "=", sessionId as SessionId)
          .execute(),
      catch: (cause) => new AuthDatabaseError({ cause }),
    });
    yield* serverLog(
      "info",
      { sessionId },
      "DB operation to delete session completed",
    );
  });

export const validateSessionEffect = (
  sessionId: string,
): Effect.Effect<
  { user: User | null; session: Session | null },
  AuthDatabaseError,
  Db | Logger
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
