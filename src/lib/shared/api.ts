// src/lib/shared/api.ts
import { Rpc, RpcGroup } from "@effect/rpc";
import { Schema } from "effect";
import { UserSchema } from "./schemas";
import { AuthMiddleware, AuthError } from "./auth";

export { AuthError };

export class RequestError extends Schema.Class<RequestError>("RequestError")({
  errorMessage: Schema.String,
}) {}

// --- RPC Definitions ---

// Group for routes that are explicitly unprotected.
const UnprotectedAuthRpc = RpcGroup.make(
  Rpc.make("login", {
    success: Schema.Struct({
      user: UserSchema,
      sessionId: Schema.String,
    }),
    error: AuthError,
    payload: {
      email: Schema.String,
      password: Schema.String,
    },
  }),

  Rpc.make("signup", {
    success: UserSchema, // On success, it returns the created user
    error: AuthError,
    payload: {
      email: Schema.String,
      password: Schema.String,
    },
  }),

  Rpc.make("verifyEmail", {
    success: Schema.Struct({
      user: UserSchema,
      sessionId: Schema.String,
    }),
    error: AuthError,
    payload: {
      token: Schema.String,
    },
  }),
);

// Group for routes that ARE protected by authentication.
const ProtectedAuthRpc = RpcGroup.make(
  Rpc.make("me", {
    success: UserSchema,
    error: AuthError,
  }),
  Rpc.make("logout", {
    success: Schema.Void,
    error: AuthError,
  }),
  // ✅ ADDED: New RPC for changing password.
  Rpc.make("changePassword", {
    success: Schema.Void,
    error: AuthError,
    payload: {
      oldPassword: Schema.String,
      newPassword: Schema.String.pipe(Schema.minLength(8)),
    },
  }),
).middleware(AuthMiddleware);

// The final exported group merges them.
export const AuthRpc = UnprotectedAuthRpc.merge(ProtectedAuthRpc);
