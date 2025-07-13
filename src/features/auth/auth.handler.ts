// src/features/auth/auth.handler.ts
import { Effect, Data } from "effect";
import { AuthRpc } from "../../lib/shared/api";
import { Auth, deleteSessionEffect } from "../../lib/server/auth";
// Correctly import the User *type* and other necessary types
import type { User, UserId } from "../../lib/shared/schemas";
import { AuthError } from "../../lib/shared/auth";
class NotImplementedError extends Data.TaggedError("NotImplementedError") {}

export const AuthRpcLayer = AuthRpc.toLayer({
  // Unprotected handler for signing up
  SignUpRequest: (params) =>
    Effect.gen(function* () {
      const safeLogParams = { email: params.email };
      yield* Effect.logInfo(safeLogParams, "Handling SignUpRequest").pipe(
        Effect.annotateLogs({
          passwordLength: params.password.length,
          module: "RpcAuth",
        }),
      );
      // In a real app, you would add user creation logic here.
      return true;
    }),

  // Unprotected handler for logging in
  login: (credentials) =>
    Effect.gen(function* () {
      yield* Effect.logInfo({ email: credentials.email }, "Login attempt");

      // Placeholder: Create a mock user that matches the *full* User schema
      const placeholderUser: User = {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" as UserId,
        email: credentials.email,
        password_hash: "mock_hash",
        created_at: new Date(),
        permissions: [],
        avatar_url: null,
        email_verified: true,
      };
      const placeholderSessionId = "mock-session-id";

      return { user: placeholderUser, sessionId: placeholderSessionId };
    }),

  // Protected handler to get the current user
  me: () =>
    Effect.gen(function* () {
      const { user } = yield* Auth;
      const safeUserLog = {
        userId: user!.id,
        userEmail: user!.email
      };
      yield* Effect.logDebug(safeUserLog, `'me' request successful`);

      // The 'user' object from the Auth context already matches the full User schema.
      // Simply return it directly.
      return user!;
    }),

  // Protected handler for logging out
  logout: () =>
    Effect.gen(function* () {
      const { session } = yield* Auth;
      yield* Effect.logInfo({ userId: session!.user_id }, `User initiated logout`);

      yield* deleteSessionEffect(session!.id).pipe(
        Effect.catchAll((err) =>
          Effect.logError("Failed to delete session on logout", err)
        ),
      );
    }),
});
