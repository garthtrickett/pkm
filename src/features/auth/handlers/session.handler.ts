// src/features/auth/handlers/session.handler.ts
import { Effect } from "effect";
import { Argon2id } from "oslo/password";
import type { LoginPayload } from "../../../lib/shared/api";
import { Auth, AuthError } from "../../../lib/shared/auth";
// ✅ IMPORT: Import session logic from the new, dedicated service file.
import {
  createSessionEffect,
  deleteSessionEffect,
} from "../../../lib/server/session.service";
import { Db } from "../../../db/DbTag";
import { InvalidCredentialsError, EmailNotVerifiedError } from "../Errors";

export const SessionRpcHandlers = {
  login: (credentials: LoginPayload) =>
    Effect.gen(function* () {
      yield* Effect.logInfo(
        { email: credentials.email },
        "Login handler started",
      );
      const db = yield* Db;

      const user = yield* Effect.promise(() =>
        db
          .selectFrom("user")
          .selectAll()
          .where("email", "=", credentials.email)
          .executeTakeFirst(),
      );

      yield* Effect.logDebug(
        { userFound: !!user },
        "User lookup result from DB",
      );

      if (!user) {
        yield* Effect.logWarning(
          { email: credentials.email },
          "User not found in DB",
        );
        return yield* Effect.fail(new InvalidCredentialsError());
      }

      const argon2id = new Argon2id();
      const validPassword = yield* Effect.tryPromise({
        try: () => argon2id.verify(user.password_hash, credentials.password),
        catch: (e) => {
          Effect.logError("Password verification failed with an error", e);
          return false;
        },
      });

      yield* Effect.logDebug({ validPassword }, "Password verification result");

      if (!validPassword) {
        yield* Effect.logWarning(
          { email: user.email },
          "Invalid password provided",
        );
        return yield* Effect.fail(new InvalidCredentialsError());
      }

      yield* Effect.logDebug(
        { isVerified: user.email_verified },
        "Email verification check",
      );

      if (!user.email_verified) {
        yield* Effect.logWarning(
          { email: user.email },
          "Login attempt with unverified email",
        );
        return yield* Effect.fail(new EmailNotVerifiedError());
      }

      const sessionId = yield* createSessionEffect(user.id);

      yield* Effect.logInfo(
        { userId: user.id, sessionId },
        "Login successful, session created",
      );

      const { password_hash: _, ...publicUser } = user;
      return { user: publicUser, sessionId };
    }).pipe(
      Effect.catchTags({
        InvalidCredentialsError: () => {
          return Effect.logDebug(
            "[login.handler] Mapping InvalidCredentialsError to AuthError.",
          ).pipe(
            Effect.andThen(
              Effect.fail(
                new AuthError({
                  _tag: "Unauthorized",
                  message: "Invalid credentials",
                }),
              ),
            ),
          );
        },
        EmailNotVerifiedError: () => {
          return Effect.logDebug(
            "[login.handler] Mapping EmailNotVerifiedError to AuthError.",
          ).pipe(
            Effect.andThen(
              Effect.fail(
                new AuthError({
                  _tag: "Forbidden",
                  message: "Email not verified",
                }),
              ),
            ),
          );
        },
      }),
      Effect.catchAll((error) => {
        if (error instanceof AuthError) {
          return Effect.logDebug(
            "[login.handler] Passing through intentional AuthError to client.",
            { error },
          ).pipe(Effect.andThen(Effect.fail(error)));
        }
        return Effect.logError("Unhandled error during login", {
          cause: error,
          email: credentials.email,
        }).pipe(
          Effect.andThen(
            Effect.fail(
              new AuthError({
                _tag: "InternalServerError",
                message: "An internal server error occurred.",
              }),
            ),
          ),
        );
      }),
    ),

  me: () =>
    Effect.gen(function* () {
      const { user } = yield* Auth;
      yield* Effect.logDebug({ userId: user!.id }, `'me' request successful`);
      const { password_hash: _, ...publicUser } = user!;
      return publicUser;
    }),

  logout: () =>
    Effect.gen(function* () {
      const { session } = yield* Auth;
      yield* Effect.logInfo(
        { userId: session!.user_id },
        `User initiated logout`,
      );

      yield* deleteSessionEffect(session!.id).pipe(
        Effect.catchAll((err) =>
          Effect.logError("Failed to delete session on logout", err),
        ),
      );
    }),
};
