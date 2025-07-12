// src/user.ts
import { Rpc, RpcGroup } from "@effect/rpc";
import { Schema, Effect } from "effect";
import { AuthMiddleware, Auth } from "./lib/server/auth";

// Define a user with an ID and name
// This is the shape of the data returned by the RPC
export class User extends Schema.Class<User>("User")({
  id: Schema.String,
  name: Schema.String,
}) {}

export const UserRpcs = RpcGroup.make(
  Rpc.make("GetUser", {
    success: User,
    error: Schema.Never, // Handler will provide specific error
  }),
).middleware(AuthMiddleware);

export const RpcUserLayer = UserRpcs.toLayer({
  GetUser: () =>
    Effect.gen(function* () {
      const { user } = yield* Auth;
      if (!user) {
        // This should theoretically not be hit if middleware is applied correctly,
        // but it's good practice to handle it.
        return yield* Effect.die(new Error("User not found in context"));
      }
      yield* Effect.log(`Authenticated user: ${user.email}`);
      return new User({ id: user.id, name: user.email });
    }),
});
