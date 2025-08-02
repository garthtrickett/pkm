// src/lib/server/JwtService.ts
import { Context, Data, Effect, Layer, Redacted, Schema } from "effect";
import { createJWT, validateJWT } from "oslo/jwt";
import { TimeSpan } from "oslo";

import { Db } from "../../db/DbTag";
import type { PublicUser } from "../shared/schemas";
import { PublicUserSchema, UserIdSchema } from "../shared/schemas";
import { AuthError } from "../shared/auth";
import { Config } from "./Config";

// --- Custom Errors ---

class JwtGenerationError extends Data.TaggedError("JwtGenerationError")<{
  readonly cause: unknown;
}> {}

class JwtValidationError extends Data.TaggedError("JwtValidationError")<{
  readonly cause: unknown;
}> {}

// --- Service Definition ---

export interface IJwtService {
  readonly generateToken: (
    user: PublicUser,
  ) => Effect.Effect<string, JwtGenerationError>;
  readonly validateToken: (
    token: string,
  ) => Effect.Effect<PublicUser, AuthError, Db>;
}

export class JwtService extends Context.Tag("app/JwtService")<
  JwtService,
  IJwtService
>() {}

// --- Live Implementation ---

export const JwtServiceLive = Layer.effect(
  JwtService,
  Effect.gen(function* () {
    const config = yield* Config;
    const db = yield* Db;
    const jwtSecret = Redacted.value(config.jwt.secret);
    const secretKey = new TextEncoder().encode(jwtSecret);

    const generateToken = (user: PublicUser) =>
      Effect.tryPromise({
        try: () =>
          createJWT(
            "HS256",
            secretKey,
            { user }, // Embed the public user object in the payload
            {
              subject: user.id,
              expiresIn: new TimeSpan(30, "d"),
              includeIssuedTimestamp: true,
            },
          ),
        catch: (cause) => new JwtGenerationError({ cause }),
      });

    const validateToken = (token: string) =>
      Effect.gen(function* () {
        // <<< ADDED LOGGING
        yield* Effect.logDebug(
          `[JwtService] Starting token validation for token: ${token.substring(0, 15)}...`,
        );

        const jwt = yield* Effect.tryPromise({
          try: () => validateJWT("HS256", secretKey, token),
          // <<< ADDED LOGGING
          catch: (cause) => {
            Effect.runSync(
              Effect.logError(
                "[JwtService] CRITICAL: validateJWT threw an error.",
                { error: cause },
              ),
            );
            return new JwtValidationError({ cause });
          },
        });

        // <<< ADDED LOGGING
        yield* Effect.logDebug(
          "[JwtService] Token signature and expiration are valid.",
          {
            payload: jwt,
          },
        );

        if (!jwt.subject) {
          // <<< ADDED LOGGING
          yield* Effect.logError(
            "[JwtService] Token is missing 'sub' (subject) claim.",
          );
          return yield* Effect.fail(
            new JwtValidationError({
              cause: "Invalid token payload: missing sub claim",
            }),
          );
        }

        const userId = yield* Schema.decodeUnknown(UserIdSchema)(jwt.subject);

        // <<< ADDED LOGGING
        yield* Effect.logDebug(
          `[JwtService] Token subject parsed as userId: ${userId}.`,
        );
        yield* Effect.logDebug("[JwtService] Looking up user in database...");

        const user = yield* Effect.promise(() =>
          db
            .selectFrom("user")
            .selectAll()
            .where("id", "=", userId)
            .executeTakeFirst(),
        ).pipe(
          Effect.mapError((cause) => new JwtValidationError({ cause })),
          Effect.flatMap(Effect.fromNullable),
        );

        // <<< ADDED LOGGING
        yield* Effect.logDebug("[JwtService] User found in database.", {
          userId: user.id,
        });
        yield* Effect.logDebug(
          "[JwtService] Parsing database user record into PublicUser schema.",
        );

        return yield* Schema.decodeUnknown(PublicUserSchema)(user);
      }).pipe(
        Effect.catchTags({
          JwtValidationError: (e) =>
            // <<< ADDED LOGGING
            Effect.logWarning(
              "[JwtService] Token validation failed. Mapping to Unauthorized.",
              e,
            ).pipe(
              Effect.andThen(
                Effect.fail(
                  new AuthError({
                    _tag: "Unauthorized",
                    message: "Invalid or expired token.",
                  }), //
                ),
              ),
            ),
          NoSuchElementException: () =>
            // <<< ADDED LOGGING
            Effect.logWarning(
              "[JwtService] User for token not found in DB. Mapping to Unauthorized.",
            ).pipe(
              Effect.andThen(
                Effect.fail(
                  new AuthError({
                    _tag: "Unauthorized",
                    message: "User for token not found.",
                  }),
                ),
              ),
            ),
          ParseError: (cause) =>
            Effect.logError(
              "Failed to parse user from DB after JWT validation",
              cause,
            ).pipe(
              Effect.andThen(
                Effect.fail(
                  new AuthError({
                    _tag: "InternalServerError",
                    message: "User data is invalid.",
                  }),
                ),
              ),
            ),
        }),
      );

    return JwtService.of({
      generateToken,
      validateToken,
    });
  }),
);
