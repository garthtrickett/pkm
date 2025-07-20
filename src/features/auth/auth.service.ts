// src/features/auth/auth.service.ts
import { Effect } from "effect";
import { createDate, TimeSpan } from "oslo";
import { Db } from "../../db/DbTag";
import { Crypto } from "../../lib/server/crypto";
import { generateId } from "../../lib/server/utils";
import type { UserId } from "../../lib/shared/schemas";
import type { EmailVerificationTokenId } from "../../types/generated/public/EmailVerificationToken";
import type { PasswordResetTokenId } from "../../types/generated/public/PasswordResetToken";
import { TokenCreationError } from "./Errors";

// A placeholder for a future email service.
export const sendVerificationEmail = (email: string, token: string) =>
  Effect.logInfo(
    { email, verificationLink: `http://localhost:5173/verify-email/${token}` },
    "TODO: Implement email sending. Sending verification email.",
  );

// Placeholder for sending the password reset email
export const sendPasswordResetEmail = (email: string, token: string) =>
  Effect.logInfo(
    { email, resetLink: `https://localhost:5173/reset-password/${token}` },
    "TODO: Implement email sending. Sending password reset email.",
  );

export const createVerificationToken = (
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

// Helper to create a password reset token
export const createPasswordResetToken = (
  userId: UserId,
): Effect.Effect<string, TokenCreationError, Db | Crypto> =>
  Effect.gen(function* () {
    const db = yield* Db;
    // Invalidate all existing tokens for this user
    yield* Effect.promise(() =>
      db
        .deleteFrom("password_reset_token")
        .where("user_id", "=", userId)
        .execute(),
    );

    const tokenId = yield* generateId(40);
    yield* Effect.tryPromise({
      try: () =>
        db
          .insertInto("password_reset_token")
          .values({
            id: tokenId as PasswordResetTokenId,
            user_id: userId,
            expires_at: createDate(new TimeSpan(2, "h")),
          })
          .execute(),
      catch: (cause) => new TokenCreationError({ cause }),
    });
    return tokenId;
  });
