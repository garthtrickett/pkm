// src/features/auth/auth.handler.ts
import { Effect } from "effect";
import { AuthRpc, AuthError } from "../../lib/shared/api";
import { Auth, deleteSessionEffect } from "../../lib/server/auth";
import { serverLog } from "../../lib/server/logger.server";

// This layer provides handlers for all procedures defined in the AuthRpc group.
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
      const auth = yield* Auth;
      if (!auth.user) {
        return yield* Effect.fail(
          new AuthError({
            _tag: "Unauthorized",
            message: "Authentication required",
          }),
        );
      }
      return auth.user;
    }),

  // Protected handler for logging out
  logout: () =>
    Effect.gen(function* () {
      const auth = yield* Auth;
      if (auth.session) {
        yield* deleteSessionEffect(auth.session.id).pipe(
          Effect.catchAll((err) =>
            serverLog(
              "error",
              { error: err },
              "Failed to delete session on logout",
            ),
          ),
        );
      }
      // No return value needed as the RPC success is Schema.Void
    }),
});
