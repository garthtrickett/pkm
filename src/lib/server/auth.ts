// src/lib/server/auth.ts
import { Effect, Layer, Metric, Option, Schema } from "effect";
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
import {
  Auth,
  AuthError,
  AuthMiddleware as AuthMiddlewareTag,
} from "../shared/auth"; // Shared context
import { Db } from "../../db/DbTag";
import { Crypto } from "./crypto";
import { sessionValidationSuccessCounter } from "./metrics";
import { generateId } from "./utils";

// Re-export for convenience in other server files
export { Auth, AuthError };

// This is still needed for plain HTTP routes that require auth.
export const httpAuthMiddleware = HttpMiddleware.make((app) =>
  Effect.gen(function* () {
    const request = yield* HttpServerRequest.HttpServerRequest;
    const sessionIdOption = getSessionIdFromRequest({
      headers: request.headers,
    });

    if (Option.isNone(sessionIdOption)) {
      return yield* Effect.fail(
        HttpServerResponse.json({ error: "Unauthorized" }, { status: 401 }),
      );
    }

    const validationResult = yield* validateSessionEffect(
      sessionIdOption.value,
    );

    if (!validationResult.user || !validationResult.session) {
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
    const authService = Auth.of({
      user: validationResult.user,
      session: validationResult.session,
    });
    return yield* Effect.provideService(app, Auth, authService);
  }),
);

// ✅ FINAL, CORRECT FIX:
// The service for the AuthMiddlewareTag is a FUNCTION.
// We use Layer.effect to create this function, allowing us to inject `Db` into its closure.
export const AuthMiddlewareLive = Layer.effect(
  AuthMiddlewareTag,
  Effect.gen(function* () {
    // This outer Effect runs once to create the middleware function.
    // We acquire dependencies like `Db` here.
    const db = yield* Db;

    // This returned function IS the middleware. It matches the RpcMiddleware interface.
    // It takes an `options` object and returns an Effect with a `never` context.
    return (options: { readonly headers: Headers }) => {
      const sessionIdOption = getSessionIdFromRequest({
        headers: options.headers,
      });

      if (Option.isNone(sessionIdOption)) {
        return Effect.fail(
          new AuthError({
            _tag: "Unauthorized",
            message: "No session found",
          }),
        );
      }

      // We use the `db` instance from the closure to provide the dependency
      // for this specific effect chain, satisfying its context requirement.
      return validateSessionEffect(sessionIdOption.value).pipe(
        Effect.provideService(Db, db),
        Effect.flatMap((validationResult) => {
          if (!validationResult.user || !validationResult.session) {
            return Effect.fail(
              new AuthError({
                _tag: "Unauthorized",
                message: "Invalid session",
              }),
            );
          }

          return Metric.increment(sessionValidationSuccessCounter).pipe(
            Effect.map(() =>
              Auth.of({
                user: validationResult.user,
                session: validationResult.session,
              }),
            ),
          );
        }),
      );
    };
  }),
);

/* ───────────────────────────────── Helper functions (unchanged) ───────────────────────────────── */
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
