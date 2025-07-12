// src/lib/server/auth.ts
import { Effect, Layer, Option, Schema } from "effect";
import { UserSchema } from "../shared/schemas"; 
import { serverLog, Logger } from "./logger.server";
import { Db } from "../../db/DbTag";
import { Crypto } from "./crypto";
import { generateId } from "./utils";
import { createDate, TimeSpan } from "oslo";
import { AuthDatabaseError } from "../../features/auth/Errors";
import type { User } from "../shared/schemas";
import type { Session, SessionId } from "../../types/generated/public/Session";
import type { UserId } from "../../types/generated/public/User";
import type { Headers } from "@effect/platform/Headers";

// ✅ FIX: Import the shared definitions
import { Auth, AuthMiddleware, AuthError } from "../shared/auth";

// Re-export for convenience in other server files
export { Auth, AuthError, AuthMiddleware };

// --- LIVE IMPLEMENTATION ---
// This layer now implements the shared AuthMiddleware tag.
export const AuthMiddlewareLive = Layer.effect(
  AuthMiddleware,
  Effect.gen(function* () {
    const db = yield* Db;
    const logger = yield* Logger;

    return ({ headers }) => {
      const logic = Effect.gen(function* () {
        const sessionIdOption = getSessionIdFromRequest({ headers });

        if (Option.isNone(sessionIdOption)) {
          return { user: null, session: null };
        }
        return yield* validateSessionEffect(sessionIdOption.value);
      });

      return logic.pipe(
        Effect.catchAll((err) =>
          serverLog("error", { error: err }, "Session validation failed").pipe(
            Effect.andThen(
              Effect.fail(
                new AuthError({ message: "Invalid session", _tag: 'Unauthorized' }),
              ),
            ),
          ),
        ),
        Effect.provideService(Db, db),
        Effect.provideService(Logger, logger),
      );
    };
  }),
);

/* ───────────────────────────────── Helper functions ───────────────────────────────── */
// (The rest of this file remains the same)

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
