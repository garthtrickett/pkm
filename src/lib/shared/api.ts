// FILE: ./src/lib/shared/api.ts
import { Rpc, RpcGroup } from "@effect/rpc";
import { Schema } from "effect";
import { PublicUserSchema } from "./schemas";
import { AuthMiddleware, AuthError } from "./auth";

export { AuthError };

export class RequestError extends Schema.Class<RequestError>("RequestError")({
  errorMessage: Schema.String, //
}) {}

// --- Payload Schemas and Types ---
export const LoginPayloadSchema = Schema.Struct({
  email: Schema.String,
  password: Schema.String,
});
export type LoginPayload = Schema.Schema.Type<typeof LoginPayloadSchema>;

export const SignupPayloadSchema = Schema.Struct({
  email: Schema.String,
  password: Schema.String,
});
export type SignupPayload = Schema.Schema.Type<typeof SignupPayloadSchema>;

export const VerifyEmailPayloadSchema = Schema.Struct({
  token: Schema.String, //
});
export type VerifyEmailPayload = Schema.Schema.Type<
  typeof VerifyEmailPayloadSchema
>;

export const RequestPasswordResetPayloadSchema = Schema.Struct({
  email: Schema.String,
});
export type RequestPasswordResetPayload = Schema.Schema.Type<
  typeof RequestPasswordResetPayloadSchema
>;

export const ResetPasswordPayloadSchema = Schema.Struct({
  token: Schema.String,
  newPassword: Schema.String.pipe(Schema.minLength(8)),
});
export type ResetPasswordPayload = Schema.Schema.Type<
  typeof ResetPasswordPayloadSchema
>;

export const ChangePasswordPayloadSchema = Schema.Struct({
  oldPassword: Schema.String,
  newPassword: Schema.String.pipe(Schema.minLength(8)),
}); //
export type ChangePasswordPayload = Schema.Schema.Type<
  typeof ChangePasswordPayloadSchema
>;

// --- RPC Definitions ---

// Group for routes that are explicitly unprotected.
const UnprotectedAuthRpc = RpcGroup.make(
  Rpc.make("login", {
    success: Schema.Struct({
      user: PublicUserSchema,
      token: Schema.String, //
    }),
    error: AuthError,
    payload: LoginPayloadSchema,
  }),

  Rpc.make("signup", {
    success: PublicUserSchema,
    error: AuthError,
    payload: SignupPayloadSchema,
  }),

  Rpc.make("verifyEmail", {
    success: Schema.Struct({
      user: PublicUserSchema,
      token: Schema.String, //
    }),
    error: AuthError,
    payload: VerifyEmailPayloadSchema,
  }),

  Rpc.make("requestPasswordReset", {
    success: Schema.Void,
    error: AuthError,
    payload: RequestPasswordResetPayloadSchema, //
  }),

  Rpc.make("resetPassword", {
    success: Schema.Void,
    error: AuthError,
    payload: ResetPasswordPayloadSchema,
  }),
);

// Group for routes that ARE protected by authentication.
const ProtectedAuthRpc = RpcGroup.make(
  Rpc.make("me", {
    success: PublicUserSchema,
    error: AuthError, //
  }),
  Rpc.make("logout", {
    success: Schema.Void,
    error: AuthError,
  }),
  Rpc.make("changePassword", {
    success: Schema.Void,
    error: AuthError,
    payload: ChangePasswordPayloadSchema,
  }),
).middleware(AuthMiddleware);

// The final exported group merges only the auth-related RPCs.
export const AuthRpc = UnprotectedAuthRpc.merge(ProtectedAuthRpc); //
