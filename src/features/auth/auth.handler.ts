// src/features/auth/auth.handler.ts
import { Effect } from "effect";
import { AuthRpc } from "../../lib/shared/api";
import { Auth } from "../../lib/shared/auth";
import {
  createSessionEffect,
  deleteSessionEffect,
} from "../../lib/server/auth";
import { Db } from "../../db/DbTag";
import { Argon2id } from "oslo/password";
import {
  EmailAlreadyExistsError,
  EmailNotVerifiedError,
  InvalidCredentialsError,
  PasswordHashingError,
  TokenCreationError,
  TokenInvalidError,
} from "./Errors";
import { AuthError } from "../../lib/shared/auth";
import type { UserId } from "../../lib/shared/schemas";
import { generateId } from "../../lib/server/utils";
import { Crypto } from "../../lib/server/crypto";
import { createDate, TimeSpan, isWithinExpirationDate } from "oslo";
import type { EmailVerificationTokenId } from "../../types/generated/public/EmailVerificationToken";

// A placeholder for a future email service.
const sendVerificationEmail = (email: string, token: string) =>
  Effect.logInfo(
    { email, verificationLink: `http://localhost:5173/verify-email/${token}` },
    "TODO: Implement email sending. Sending verification email.",
  );

const createVerificationToken = (
  userId: UserId,
  email: string,
): Effect.Effect<string, TokenCreationError, Db | Crypto> =>
  Effect.gen(function* () {
    const db = yield* Db;
    const verificationToken = yield* generateId(40);
    yield* Effect.tryPromise({
      try: () =>
        db
          .insertInto("email_verification_token")
          .values({
            id: verificationToken as EmailVerificationTokenId,
            user_id: userId,
            email: email,
            expires_at: createDate(new TimeSpan(2, "h")),
          })
          .execute(),
      catch: (cause) => new TokenCreationError({ cause }),
    });
    return verificationToken;
  });

export const AuthRpcHandlers = AuthRpc.of({
  signup: (credentials) =>
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

  verifyEmail: ({ token }) =>
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
  login: (credentials) =>
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
        Effect.logError("Unhandled error during login", {
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
        ),
      ),
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

  changePassword: ({ oldPassword, newPassword }) =>
    Effect.gen(function* () {
      const { user: contextUser } = yield* Auth;

      // --- 🪵 EXHAUSTIVE LOG: Confirm handler entry with context ---
      if (!contextUser) {
        yield* Effect.logError(
          "[changePassword] CRITICAL: Handler entered but contextUser is null. This should not happen after AuthMiddleware.",
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
        "[changePassword] Handler started with authenticated user from context.",
      );
      // ---

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

      yield* Effect.logDebug(
        {
          userId: fullUser.id,
          retrievedHash: fullUser.password_hash.substring(0, 20) + "...",
        },
        "[changePassword] Fetched full user record from DB for verification",
      );

      const argon2id = new Argon2id();
      const validPassword = yield* Effect.promise(() =>
        argon2id.verify(fullUser.password_hash, oldPassword),
      ).pipe(Effect.catchAll(() => Effect.succeed(false)));

      yield* Effect.logDebug(
        { validPassword },
        "[changePassword] Password verification result",
      );

      if (!validPassword) {
        yield* Effect.logWarning(
          { userId: fullUser.id },
          "[changePassword] Old password verification FAILED. Aborting.",
        );
        return yield* Effect.fail(new InvalidCredentialsError());
      }

      yield* Effect.logDebug(
        { userId: fullUser.id },
        "[changePassword] Old password verification SUCCEEDED. Proceeding to hash new password.",
      );

      const newPasswordHash = yield* Effect.tryPromise({
        try: () => argon2id.hash(newPassword),
        catch: (cause) => new PasswordHashingError({ cause }),
      });

      yield* Effect.logDebug(
        {
          userId: fullUser.id,
          newHash: newPasswordHash.substring(0, 20) + "...",
        },
        "[changePassword] New password hashed. Updating in database.",
      );

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
        "[changePassword] Password successfully changed in database.",
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
});
