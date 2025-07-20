// src/lib/client/errors.ts
import { Data } from "effect";

// --- Login/Auth Errors ---
export class LoginInvalidCredentialsError extends Data.TaggedError(
  "LoginInvalidCredentialsError",
) {}
export class LoginEmailNotVerifiedError extends Data.TaggedError(
  "LoginEmailNotVerifiedError",
) {}
export class EmailInUseError extends Data.TaggedError("EmailInUseError") {}
export class PasswordsDoNotMatchError extends Data.TaggedError(
  "PasswordsDoNotMatchError",
) {}
export class IncorrectPasswordError extends Data.TaggedError(
  "IncorrectPasswordError",
) {}
export class PasswordTooShortError extends Data.TaggedError(
  "PasswordTooShortError",
) {}
export class InvalidTokenError extends Data.TaggedError("InvalidTokenError") {}

// Generic fallback for auth
export class UnknownAuthError extends Data.TaggedError("UnknownAuthError")<{
  readonly cause: unknown;
}> {}

// --- Error Types ---
export class UnknownPasswordError extends Data.TaggedError(
  "UnknownPasswordError",
)<{
  readonly cause: unknown;
}> {}

export type LoginError =
  | LoginInvalidCredentialsError
  | LoginEmailNotVerifiedError
  | UnknownAuthError;

export type SignupError =
  | PasswordsDoNotMatchError
  | EmailInUseError
  | UnknownAuthError;

export type ForgotPasswordError = UnknownAuthError;

export type ResetPasswordError =
  | PasswordTooShortError
  | PasswordsDoNotMatchError
  | InvalidTokenError
  | UnknownAuthError;

// ✅ ADDED: A type union for all possible email verification errors
export type VerifyEmailError = InvalidTokenError | UnknownAuthError;

// --- User Profile Errors ---
export class AvatarUploadError extends Data.TaggedError("AvatarUploadError")<{
  readonly message: string; // Keep message for specific feedback
  readonly cause?: unknown;
}> {}
