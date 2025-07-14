// src/features/auth/auth.handler.ts
import { Effect } from "effect";
import { AuthRpc } from "../../lib/shared/api";
import { Auth } from "../../lib/shared/auth";
import { createSessionEffect, deleteSessionEffect } from "../../lib/server/auth";
import { Db } from "../../db/DbTag";
import { Argon2id } from "oslo/password";
import {
  EmailNotVerifiedError,
  InvalidCredentialsError,
} from "./Errors";
import { AuthError } from "../../lib/shared/auth";

export const AuthRpcLayer = AuthRpc.toLayer({
  // Unprotected handler for signing up
  SignUpRequest: (params) =>
    Effect.gen(function* () {
      const safeLogParams = { email: params.email };
      yield* Effect.logInfo(safeLogParams, "Handling SignUpRequest").pipe(
        Effect.annotateLogs({
          passwordLength: params.password.length,
          module: "RpcAuth",
        }),
      );
      return true;
    }),

  // Unprotected handler for logging in
  login: (credentials) =>
    Effect.gen(function* () {
      yield* Effect.logInfo({ email: credentials.email }, "Login attempt");
      const db = yield* Db;

      const userResult = yield* Effect.promise(() =>
        db
          .selectFrom("user")
          .selectAll()
          .where("email", "=", credentials.email)
          .execute(),
      );

      const user = userResult[0];
      if (!user) {
        return yield* Effect.fail(new InvalidCredentialsError());
      }

      const argon2id = new Argon2id();
      const validPassword = yield* Effect.tryPromise({
        try: () => argon2id.verify(user.password_hash, credentials.password),
        catch: () => new InvalidCredentialsError(),
      });

      if (!validPassword) {
        return yield* Effect.fail(new InvalidCredentialsError());
      }

      if (!user.email_verified) {
        return yield* Effect.fail(new EmailNotVerifiedError());
      }

      const sessionId = yield* createSessionEffect(user.id);

      yield* Effect.logInfo(
        { userId: user.id, email: user.email },
        "Login successful, session created",
      );

      return { user, sessionId };
    }).pipe(
      Effect.catchTags({
        InvalidCredentialsError: () =>
          Effect.fail(
            new AuthError({
              _tag: "Unauthorized",
              message: "Invalid credentials",
            }),
          ),
        EmailNotVerifiedError: () =>
          Effect.fail(
            new AuthError({
              _tag: "Forbidden",
              message: "Email not verified",
            }),
          ),
      }),
      Effect.catchAll((error) =>
        Effect.logError("Unhandled error during login", error).pipe(
          Effect.andThen(Effect.fail(new AuthError({
            _tag: "InternalServerError",
            message: "An internal server error occurred."
          })))
        )
      )
    ),

  me: () =>
    Effect.gen(function* () {
      const { user } = yield* Auth;
      const safeUserLog = {
        userId: user!.id,
        userEmail: user!.email,
      };
      yield* Effect.logDebug(safeUserLog, `'me' request successful`);
      return user!;
    }),

  logout: () =>
    Effect.gen(function* () {
      const { session } = yield* Auth;
      yield* Effect.logInfo({ userId: session!.user_id }, `User initiated logout`);

      yield* deleteSessionEffect(session!.id).pipe(
        Effect.catchAll((err) =>
          Effect.logError("Failed to delete session on logout", err),
        ),
      );
    }),
});
