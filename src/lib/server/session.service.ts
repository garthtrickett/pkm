// src/lib/server/session.service.ts
import type { Headers } from "@effect/platform/Headers";
import { Effect, Option, Schema } from "effect";
import { createDate, TimeSpan } from "oslo";
import { Db } from "../../db/DbTag";
import { AuthDatabaseError } from "../../features/auth/Errors";
import type { Session, SessionId } from "../../types/generated/public/Session";
import type { UserId } from "../../types/generated/public/User";
import type { User } from "../shared/schemas";
import { UserSchema } from "../shared/schemas";
import { Crypto } from "./crypto";
import { generateId } from "./utils";

/* ───────────────────────────────── Helper Functions ───────────────────────────────── */

/**
 * Extracts the session ID from the 'cookie' header of a request.
 * @param req An object containing request headers.
 * @returns An `Option` which is `Some<string>` if the session cookie is found, otherwise `None`.
 */
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

/**
 * Creates a new session for a given user ID and stores it in the database.
 * @param userId The ID of the user to create a session for.
 * @returns An Effect that resolves to the new session ID string.
 */
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

/**
 * Deletes a session from the database.
 * @param sessionId The ID of the session to delete.
 * @returns An Effect that completes when the session is deleted.
 */
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

/**
 * Validates a session ID, checking for its existence and expiration.
 * If the session is valid, it fetches the associated user.
 * @param sessionId The session ID to validate.
 * @returns An Effect resolving to an object with the user and session (or nulls if invalid).
 */
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
