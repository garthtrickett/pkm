// src/user.ts
import { Rpc, RpcGroup } from "@effect/rpc";
import { Schema } from "effect";

// Define a user with an ID and name
export class User extends Schema.Class<User>("User")({
  id: Schema.String, // User's ID as a string
  name: Schema.String, // User's name as a string
}) {}

// Define a group of RPCs for user management
export class UserRpcs extends RpcGroup.make(
  Rpc.make("GetUser", {
    success: User,
  }),
) {} // .middleware(AuthMiddleware) has been removed
