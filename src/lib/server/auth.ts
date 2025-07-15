// src/lib/server/auth.ts
import { Effect, Metric, Option, Schema } from "effect";
import {
  HttpMiddleware,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import type { Headers } from "@effect/platform/Headers";
import { createDate, TimeSpan } from "oslo";

import { AuthDatabaseError } from "../../features/auth/Errors";
import type { Session, SessionId } from "../../types/generated/public/Session";
import type { User, UserId } from "../../types/generated/public/User";
import { UserSchema } from "../shared/schemas";
import { Auth, AuthError } from "../shared/auth"; // Shared context
import { Db } from "../../db/DbTag";
import { Crypto } from "./crypto";
import { sessionValidationSuccessCounter } from "./metrics";
import { generateId } from "./utils";

// Re-export for convenience in other server files
export { Auth, AuthError };

// This is now the ONLY authentication middleware. It will wrap both plain HTTP routes
// and the entire RPC application.
export const httpAuthMiddleware = HttpMiddleware.make((app) =>
  Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest;
    const sessionIdOption = getSessionIdFromRequest({
      headers: request.headers,
    });

    if (Option.isNone(sessionIdOption)) {
      // If no session, immediately fail the request with a 401.
      return yield* Effect.fail(
        HttpServerResponse.json({ error: "Unauthorized" }, { status: 401 }),
      );
    }

    // If a session cookie exists, validate it.
    const validationResult = yield* validateSessionEffect(
      sessionIdOption.value,
    ).pipe(Effect.provideService(Db, yield* Db));

    if (!validationResult.user || !validationResult.session) {
      // If validation fails, fail with a 401 and include a header to clear the bad cookie.
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

    // If validation succeeds, provide the Auth service to the wrapped application.
    yield* Metric.increment(sessionValidationSuccessCounter);
    const authService = Auth.of({
      user: validationResult.user,
      session: validationResult.session,
    });
    return yield* Effect.provideService(app, Auth, authService);
  }),
);

/* ───────────────────────────────── Helper functions ───────────────────────────────── */
export const getSessionIdFromRequest = (req: {
  headers: Headers;
}): Option.Option<string> => {
  const plainHeaders = JSON.parse(JSON.stringify(req.headers));
  const cookieHeader = plainHeaders["cookie"] ?? plainHeaders["Cookie"];
  return Option.fromNullable(cookieHeader).pipe(
    Option.map((header) => String(header).split("; ")),
    Option.flatMap((cookies) =>
      Option.fromNullable(cookies.find((c) => c.startsWith("session_id="))),
    ),
    Option.flatMap((cookie) => Option.fromNullable(cookie.split("=")[1])),
  );
};

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
