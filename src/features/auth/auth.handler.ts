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
// ✅ Add new error for signup
import {
  EmailAlreadyExistsError,
  EmailNotVerifiedError,
  InvalidCredentialsError,
  // ✅ FIX 1: Import the PasswordHashingError
  PasswordHashingError,
} from "./Errors";
import { AuthError } from "../../lib/shared/auth";
import type { User } from "../../lib/shared/schemas";

// A placeholder for a future email service.
const sendVerificationEmail = (email: string, token: string) =>
  Effect.logInfo(
    { email, token },
    "TODO: Implement email sending. Sending verification email.",
  );

export const AuthRpcLayer = AuthRpc.toLayer({
  signup: (credentials) =>
    Effect.gen(function* () {
      yield* Effect.logInfo({ email: credentials.email }, "Signup attempt");
      const db = yield* Db;

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
        // ✅ FIX 2: Use a typed error here instead of a generic Error
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

      const verificationToken = `fake-token-for-${newUser.id}`;
      yield* sendVerificationEmail(newUser.email, verificationToken);

      return newUser as User;
    }).pipe(
      Effect.catchTags({
        EmailAlreadyExistsError: () =>
          Effect.fail(
            new AuthError({
              _tag: "EmailAlreadyExistsError",
              message: "A user with this email already exists.",
            }),
          ),
        // ✅ FIX 3: Handle the new typed error and map it to a generic server error
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

  // ... (rest of the file is unchanged)
  login: (credentials) =>
    Effect.gen(function* () {
      // ✅ MODIFIED: Added more detailed logging
      yield* Effect.logInfo(
        { email: credentials.email },
        "Login handler started",
      );
      const db = yield* Db;

      const userResult = yield* Effect.promise(() =>
        db
          .selectFrom("user")
          .selectAll()
          .where("email", "=", credentials.email)
          .execute(),
      );

      const user = userResult[0];
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
          // Log the specific argon error and treat it as an invalid password
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

      // ✅ ADDED: Log right before returning success
      yield* Effect.logInfo(
        { userId: user.id },
        "Login handler successful, returning response",
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
        // ✅ MODIFIED: Add more context to the final catch-all
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
});
