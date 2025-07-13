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
  Rpc.make("SignUpRequest", {
    error: RequestError,
    success: Schema.Boolean,
    payload: {
      email: Schema.String,
      password: Schema.String,
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
).middleware(AuthMiddleware);

// The final exported group merges them. This structure makes it clear
// to the server which middleware applies to which procedures.
export const AuthRpc = UnprotectedAuthRpc.merge(ProtectedAuthRpc);
