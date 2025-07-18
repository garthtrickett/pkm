// FILE: ./src/lib/shared/api.ts
import { Rpc, RpcGroup } from "@effect/rpc";
import { Schema } from "effect";
import { PublicUserSchema } from "./schemas";
import { AuthMiddleware, AuthError } from "./auth";

// ⛔️ Replicache schemas are no longer part of the RPC API.

export { AuthError };

export class RequestError extends Schema.Class<RequestError>("RequestError")({
  errorMessage: Schema.String,
}) {}

// --- RPC Definitions ---

// Group for routes that are explicitly unprotected.
const UnprotectedAuthRpc = RpcGroup.make(
  Rpc.make("login", {
    success: Schema.Struct({
      user: PublicUserSchema,
      sessionId: Schema.String,
    }),
    error: AuthError,
    payload: {
      email: Schema.String,
      password: Schema.String,
    },
  }),

  Rpc.make("signup", {
    success: PublicUserSchema, // On success, it returns the created user
    error: AuthError,
    payload: {
      email: Schema.String,
      password: Schema.String,
    },
  }),

  Rpc.make("verifyEmail", {
    success: Schema.Struct({
      user: PublicUserSchema,
      sessionId: Schema.String,
    }),
    error: AuthError,
    payload: {
      token: Schema.String,
    },
  }),

  Rpc.make("requestPasswordReset", {
    success: Schema.Void,
    error: AuthError, // Generic error for unknown failures
    payload: {
      email: Schema.String,
    },
  }),

  Rpc.make("resetPassword", {
    success: Schema.Void,
    error: AuthError,
    payload: {
      token: Schema.String,
      newPassword: Schema.String.pipe(Schema.minLength(8)),
    },
  }),
);

// Group for routes that ARE protected by authentication.
const ProtectedAuthRpc = RpcGroup.make(
  Rpc.make("me", {
    success: PublicUserSchema,
    error: AuthError,
  }),
  Rpc.make("logout", {
    success: Schema.Void,
    error: AuthError,
  }),
  Rpc.make("changePassword", {
    success: Schema.Void,
    error: AuthError,
    payload: {
      oldPassword: Schema.String,
      newPassword: Schema.String.pipe(Schema.minLength(8)),
    },
  }),
).middleware(AuthMiddleware);

// The final exported group merges only the auth-related RPCs.
export const AuthRpc = UnprotectedAuthRpc.merge(ProtectedAuthRpc);
