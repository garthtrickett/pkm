// src/user.ts
import { Rpc, RpcGroup } from "@effect/rpc";
import { Schema, Effect } from "effect";
// ✅ ADD: Import the middleware tag
import { Auth } from "./lib/server/auth";
import { AuthMiddleware } from "./lib/shared/auth";

// Define a user with an ID and name
// This is the shape of the data returned by the RPC
export class RpcUser extends Schema.Class<RpcUser>("RpcUser")({
  id: Schema.String,
  name: Schema.String,
}) {}

// ✅ FIX: Add the .middleware() annotation
export const UserRpcs = RpcGroup.make(
  Rpc.make("GetUser", {
    success: RpcUser,
    error: Schema.Never, // Handler will provide specific error
  }),
).middleware(AuthMiddleware); // <-- This is the key change

export const RpcUserHandlers = UserRpcs.of({
  GetUser: () =>
    Effect.gen(function* () {
      const { user } = yield* Auth;
      if (!user) {
        // This should theoretically not be hit if middleware is applied correctly,
        // but it's good practice to handle it.
        return yield* Effect.die(new Error("User not found in context"));
      }
      yield* Effect.log(`Authenticated user: ${user.email}`);
      return new RpcUser({ id: user.id, name: user.email });
    }),
});
