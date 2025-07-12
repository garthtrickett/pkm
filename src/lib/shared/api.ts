// src/lib/shared/api.ts
import { Rpc, RpcGroup } from "@effect/rpc";
import { Schema } from "effect";
import { UserSchema } from "./schemas";

// ✅ FIX: Import from the new shared file, not the server implementation.
// This prevents server-side code (like the logger) from being bundled in the client.
import { AuthMiddleware, AuthError } from "./auth";

// --- Error Schemas ---

// This error schema is already defined in the new shared/auth.ts,
// but we re-export it here for consumers of the API layer to have a single import point.
export { AuthError };

export class RequestError extends Schema.Class<RequestError>("RequestError")({
  errorMessage: Schema.String,
}) {}

// --- RPC Definitions ---

// Group for routes that DO NOT require authentication.
const AuthRpcUnprotected = RpcGroup.make(
  Rpc.make("SignUpRequest", {
    error: RequestError,
    success: Schema.Boolean,
    payload: {
      email: Schema.String,
      password: Schema.String,
    },
  }),
);

// Group for routes that ARE protected by the authentication middleware.
const AuthRpcProtected = RpcGroup.make(
  Rpc.make("me", {
    success: UserSchema,
    error: AuthError,
  }),
  Rpc.make("logout", {
    success: Schema.Void,
    error: AuthError,
  }),
).middleware(AuthMiddleware); // This is now safe as AuthMiddleware is a shared definition.

// A single, combined group for the entire auth API.
// This is what the server and client will reference.
export const AuthRpc = AuthRpcUnprotected.merge(AuthRpcProtected);
