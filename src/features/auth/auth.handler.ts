// src/features/auth/auth.handler.ts
import { Effect } from "effect";
import { AuthRpc } from "../../lib/shared/api";
import { Auth, deleteSessionEffect } from "../../lib/server/auth";
import { serverLog } from "../../lib/server/logger.server";

export const AuthRpcLayer = AuthRpc.toLayer({
  // Unprotected handler for signing up
  SignUpRequest: (params) =>
    Effect.gen(function* () {
      yield* serverLog(
        "info",
        {},
        `Handling SignUpRequest for email: ${params.email}`,
      ).pipe(
        Effect.annotateLogs({
          passwordLength: params.password.length,
          module: "RpcAuth",
        }),
      );
      // In a real app, you would add user creation logic here.
      return true;
    }),

  // Protected handler to get the current user
  me: () =>
    Effect.gen(function* () {
      // ✅ FIX: We can now safely assume `user` exists because the middleware
      // would have failed the request if it didn't.
      const { user } = yield* Auth;
      // The `if (!user)` check is now redundant and can be removed.
      return user!;
    }),

  // Protected handler for logging out
  logout: () =>
    Effect.gen(function* () {
      const { session } = yield* Auth;
      // ✅ FIX: We can assume session exists for the same reason.
      yield* deleteSessionEffect(session!.id).pipe(
        Effect.catchAll((err) =>
          serverLog(
            "error",
            { error: err },
            "Failed to delete session on logout",
          ),
        ),
      );
    }),
});
