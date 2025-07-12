// src/user.ts
import { Rpc, RpcGroup } from "@effect/rpc";
import { Schema, Effect } from "effect";
import { AuthMiddleware, Auth } from "./lib/server/auth";

// Define a user with an ID and name
export class User extends Schema.Class<User>("User")({
  id: Schema.String, // User's ID as a string
  name: Schema.String, // User's name as a string
}) {}

// Define a group of RPCs for user management
export const UserRpcs = RpcGroup.make(
  Rpc.make("GetUser", {
    // No payload needed for this example
    success: User,
  }),
).middleware(AuthMiddleware);

// The handler implementation can now access the Auth service
export const RpcUserLayer = UserRpcs.toLayer({
  GetUser: () =>
    Effect.gen(function* () {
      // Safely access the authenticated user from the context.
      const { user } = yield* Auth;
      yield* Effect.log(`Authenticated user: ${user.name}`);
      return user;
    }),
});
