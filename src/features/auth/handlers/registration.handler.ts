// src/features/auth/handlers/registration.handler.ts
import { Effect } from "effect";
import { Argon2id } from "oslo/password";
import { isWithinExpirationDate } from "oslo";
import type {
  SignupPayload,
  VerifyEmailPayload,
} from "../../../lib/shared/api";
import { AuthError } from "../../../lib/shared/auth";
import { Db } from "../../../db/DbTag";
import { Crypto } from "../../../lib/server/crypto";
// ✅ IMPORT: Import session logic from the new, dedicated service file.
import { createSessionEffect } from "../../../lib/server/session.service";
import {
  EmailAlreadyExistsError,
  PasswordHashingError,
  TokenInvalidError,
} from "../Errors";
import {
  createVerificationToken,
  sendVerificationEmail,
} from "../auth.service";
import type { EmailVerificationTokenId } from "../../../types/generated/public/EmailVerificationToken";

export const RegistrationRpcHandlers = {
  signup: (credentials: SignupPayload) =>
    Effect.gen(function* () {
      yield* Effect.logInfo({ email: credentials.email }, "Signup attempt");
      const db = yield* Db;
      const crypto = yield* Crypto;

      const existingUser = yield* Effect.promise(() =>
        db
          .selectFrom("user")
          .select("id")
          .where("email", "=", credentials.email)
          .executeTakeFirst(),
      );

      if (existingUser) {
        return yield* Effect.fail(new EmailAlreadyExistsError());
      }

      const argon2id = new Argon2id();
      const passwordHash = yield* Effect.tryPromise({
        try: () => argon2id.hash(credentials.password),
        catch: (cause) => new PasswordHashingError({ cause }),
      });

      const newUser = yield* Effect.promise(() =>
        db
          .insertInto("user")
          .values({
            email: credentials.email,
            password_hash: passwordHash,
            email_verified: false,
          })
          .returningAll()
          .executeTakeFirstOrThrow(),
      );

      yield* Effect.logInfo(
        { userId: newUser.id, email: newUser.email },
        "User created successfully",
      );

      const verificationToken = yield* createVerificationToken(
        newUser.id,
        newUser.email,
      ).pipe(Effect.provideService(Crypto, crypto));

      yield* sendVerificationEmail(newUser.email, verificationToken);

      const { password_hash: _, ...publicUser } = newUser;
      return publicUser;
    }).pipe(
      Effect.catchTags({
        EmailAlreadyExistsError: () =>
          Effect.fail(
            new AuthError({
              _tag: "EmailAlreadyExistsError",
              message: "A user with this email already exists.",
            }),
          ),
        PasswordHashingError: (error) =>
          Effect.logError("Password hashing failed during signup", error).pipe(
            Effect.andThen(
              Effect.fail(
                new AuthError({
                  _tag: "InternalServerError",
                  message: "Could not process registration.",
                }),
              ),
            ),
          ),
      }),
      Effect.catchAll((error) =>
        Effect.logError("Unhandled error during signup", error).pipe(
          Effect.andThen(
            Effect.fail(
              new AuthError({
                _tag: "InternalServerError",
                message: "An internal server error occurred.",
              }),
            ),
          ),
        ),
      ),
    ),

  verifyEmail: ({ token }: VerifyEmailPayload) =>
    Effect.gen(function* () {
      yield* Effect.logInfo(
        { tokenPrefix: token.substring(0, 8) },
        "Email verification attempt",
      );
      const db = yield* Db;
      const crypto = yield* Crypto;

      const storedToken = yield* Effect.promise(() =>
        db
          .deleteFrom("email_verification_token")
          .where("id", "=", token as EmailVerificationTokenId)
          .returningAll()
          .executeTakeFirst(),
      ).pipe(Effect.mapError((cause) => new TokenInvalidError({ cause })));

      if (!storedToken || !isWithinExpirationDate(storedToken.expires_at)) {
        return yield* Effect.fail(
          new TokenInvalidError({ cause: "Token not found or expired" }),
        );
      }

      const user = yield* Effect.promise(() =>
        db
          .updateTable("user")
          .set({ email_verified: true })
          .where("id", "=", storedToken.user_id)
          .returningAll()
          .executeTakeFirstOrThrow(),
      ).pipe(Effect.mapError((cause) => new TokenInvalidError({ cause })));

      yield* Effect.logInfo({ userId: user.id }, "Email verified successfully");

      const sessionId = yield* createSessionEffect(user.id).pipe(
        Effect.provideService(Crypto, crypto),
      );
      const { password_hash: _, ...publicUser } = user;
      return { user: publicUser, sessionId };
    }).pipe(
      Effect.catchTags({
        TokenInvalidError: () =>
          Effect.fail(
            new AuthError({
              _tag: "BadRequest",
              message: "Invalid or expired verification token.",
            }),
          ),
      }),
      Effect.catchAll((error) =>
        Effect.logError(
          "Unhandled error during email verification",
          error,
        ).pipe(
          Effect.andThen(
            Effect.fail(
              new AuthError({
                _tag: "InternalServerError",
                message: "An internal server error occurred.",
              }),
            ),
          ),
        ),
      ),
    ),
};
