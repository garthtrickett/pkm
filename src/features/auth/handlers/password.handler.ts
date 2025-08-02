// FILE: src/features/auth/handlers/password.handler.ts
import { Effect } from "effect";
import { Argon2id } from "oslo/password";
import { isWithinExpirationDate } from "oslo";
import type {
  ChangePasswordPayload,
  RequestPasswordResetPayload,
  ResetPasswordPayload,
} from "../../../lib/shared/api";
import { Auth, AuthError } from "../../../lib/shared/auth";
import { Db } from "../../../db/DbTag";
import { Crypto } from "../../../lib/server/crypto";
import {
  createPasswordResetToken,
  sendPasswordResetEmail,
} from "../auth.service";
import {
  PasswordHashingError,
  TokenInvalidError,
  InvalidCredentialsError,
} from "../Errors";
import type { PasswordResetTokenId } from "../../../types/generated/public/PasswordResetToken";

export const PasswordRpcHandlers = {
  requestPasswordReset: ({ email }: RequestPasswordResetPayload) =>
    Effect.gen(function* () {
      const db = yield* Db;
      const crypto = yield* Crypto;

      const user = yield* Effect.promise(() =>
        db
          .selectFrom("user")
          .selectAll()
          .where("email", "=", email)
          .executeTakeFirst(),
      );

      if (user && user.email_verified) {
        yield* Effect.logInfo(
          { userId: user.id },
          "Valid user found for password reset request. Creating token.",
        );
        const token = yield* createPasswordResetToken(user.id).pipe(
          Effect.provideService(Crypto, crypto),
        );
        yield* sendPasswordResetEmail(user.email, token);
      } else {
        yield* Effect.logWarning(
          { email },
          "Password reset requested for non-existent or unverified email. Silently ignoring.",
        );
      }
      return;
    }).pipe(
      Effect.catchAll((error) => {
        return Effect.logError(
          "Unhandled error during password reset request",
          error,
        ).pipe(
          Effect.andThen(
            Effect.fail(
              new AuthError({
                _tag: "InternalServerError",
                message: "An internal error occurred.",
              }),
            ),
          ),
        );
      }),
    ),

  resetPassword: ({ token, newPassword }: ResetPasswordPayload) =>
    Effect.gen(function* () {
      const db = yield* Db;
      yield* Effect.logInfo(
        { tokenPrefix: token.substring(0, 8) },
        "Password reset attempt",
      );
      const storedToken = yield* Effect.promise(() =>
        db
          .deleteFrom("password_reset_token")
          .where("id", "=", token as PasswordResetTokenId)
          .returningAll()
          .executeTakeFirst(),
      );

      if (!storedToken || !isWithinExpirationDate(storedToken.expires_at)) {
        yield* Effect.logWarning(
          "Invalid or expired password reset token used.",
        );
        return yield* Effect.fail(
          new TokenInvalidError({ cause: "Token not found or expired" }),
        );
      }

      const argon2id = new Argon2id();
      const newPasswordHash = yield* Effect.tryPromise({
        try: () => argon2id.hash(newPassword),
        catch: (cause) => new PasswordHashingError({ cause }),
      });
      yield* Effect.promise(() =>
        db
          .updateTable("user")
          .set({ password_hash: newPasswordHash })
          .where("id", "=", storedToken.user_id)
          .execute(),
      );

      yield* Effect.logInfo(
        { userId: storedToken.user_id },
        "Password successfully reset.",
      );
    }).pipe(
      Effect.catchTags({
        TokenInvalidError: () =>
          Effect.fail(
            new AuthError({
              _tag: "BadRequest",
              message: "Invalid or expired password reset token.",
            }),
          ),
        PasswordHashingError: (e) =>
          Effect.logError("Password hashing failed during reset", e).pipe(
            Effect.andThen(
              Effect.fail(
                new AuthError({
                  _tag: "InternalServerError",
                  message: "Could not reset password.",
                }),
              ),
            ),
          ),
      }),
    ),

  changePassword: ({ oldPassword, newPassword }: ChangePasswordPayload) =>
    Effect.gen(function* () {
      const { user: contextUser } = yield* Auth;

      if (!contextUser) {
        yield* Effect.logError(
          "[changePassword] CRITICAL: Handler entered but contextUser is null.",
        );
        return yield* Effect.fail(
          new AuthError({
            _tag: "InternalServerError",
            message: "Authentication context missing.",
          }),
        );
      }
      yield* Effect.logDebug(
        { userId: contextUser.id, email: contextUser.email },
        "[changePassword] Handler started with authenticated user.",
      );

      const db = yield* Db;

      const fullUser = yield* Effect.promise(() =>
        db
          .selectFrom("user")
          .selectAll()
          .where("id", "=", contextUser.id)
          .executeTakeFirstOrThrow(),
      ).pipe(
        Effect.mapError((cause) => new PasswordHashingError({ cause: cause })),
      );

      const argon2id = new Argon2id();
      const validPassword = yield* Effect.promise(() =>
        argon2id.verify(fullUser.password_hash, oldPassword),
      ).pipe(Effect.catchAll(() => Effect.succeed(false)));

      if (!validPassword) {
        yield* Effect.logWarning(
          { userId: fullUser.id },
          "[changePassword] Old password verification FAILED.",
        );
        return yield* Effect.fail(new InvalidCredentialsError());
      }

      const newPasswordHash = yield* Effect.tryPromise({
        try: () => argon2id.hash(newPassword),
        catch: (cause) => new PasswordHashingError({ cause }),
      });

      yield* Effect.tryPromise({
        try: () =>
          db
            .updateTable("user")
            .set({ password_hash: newPasswordHash })
            .where("id", "=", contextUser.id)
            .execute(),
        catch: (cause) => new PasswordHashingError({ cause }),
      });

      yield* Effect.logInfo(
        { userId: fullUser.id },
        "[changePassword] Password successfully changed.",
      );
    }).pipe(
      Effect.catchTags({
        InvalidCredentialsError: () =>
          Effect.fail(
            new AuthError({
              _tag: "Unauthorized",
              message: "Incorrect old password.",
            }),
          ),
        PasswordHashingError: (e) =>
          Effect.logError(
            "[changePassword] A password hashing or DB error occurred.",
            e,
          ).pipe(
            Effect.andThen(
              Effect.fail(
                new AuthError({
                  _tag: "InternalServerError",
                  message: "Could not update password.",
                }),
              ),
            ),
          ),
      }),
    ),
};
