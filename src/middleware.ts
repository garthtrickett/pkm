// src/middleware.ts
import { RpcMiddleware } from "@effect/rpc";
import { Context } from "effect";
import type { User } from "./user";

// A context tag which represents the current user
export class CurrentUser extends Context.Tag("CurrentUser")<
  CurrentUser,
  User
>() {}

// The context tag for the authentication middleware
export class AuthMiddleware extends RpcMiddleware.Tag<AuthMiddleware>()(
  "AuthMiddleware",
  {
    // This middleware will provide the current user context
    provides: CurrentUser,
    // This middleware requires a client implementation too
    requiredForClient: true,
  },
) {}
