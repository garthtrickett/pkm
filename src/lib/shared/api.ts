// src/lib/shared/api.ts
import { Rpc, RpcGroup } from "@effect/rpc";
import { Schema } from "effect";
import { PublicUserSchema } from "./schemas";
import { AuthError } from "./auth";

export { AuthError };

export class RequestError extends Schema.Class<RequestError>("RequestError")({
  errorMessage: Schema.String,
}) {}

// --- RPC Definitions ---

// ✅ FIX: Export this group directly.
export const UnprotectedAuthRpc = RpcGroup.make(
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
    success: PublicUserSchema,
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
);

// ✅ FIX: Export this group directly.
export const ProtectedAuthRpc = RpcGroup.make(
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
);

export const AuthRpc = UnprotectedAuthRpc.merge(ProtectedAuthRpc);
