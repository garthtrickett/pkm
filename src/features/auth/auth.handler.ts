// src/features/auth/auth.handler.ts
import { Effect } from "effect";
import { AuthRpc } from "../../lib/shared/api";
import { Auth, deleteSessionEffect } from "../../lib/server/auth";

export const AuthRpcLayer = AuthRpc.toLayer({
  // Unprotected handler for signing up
  SignUpRequest: (params) =>
    Effect.gen(function* () {
      // The `params` object contains a password, which is sensitive.
      // We explicitly pull out only the fields we want to log.
      const safeLogParams = { email: params.email };

      // Pass the structured data as the second argument to `logInfo`.
      yield* Effect.logInfo(safeLogParams, "Handling SignUpRequest").pipe(
        // You can still chain additional annotations for context.
        Effect.annotateLogs({
          // We can log the password length, but NOT the password itself.
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
      const { user } = yield* Auth;
      // The entire `user` object contains `password_hash`, which we don't want
      // to leak. We create a new object with only the safe fields.
      const safeUserLog = {
        userId: user!.id,
        userEmail: user!.email
      };
      yield* Effect.logDebug(safeUserLog, `'me' request successful`);
      return user!;
    }),

  // Protected handler for logging out
  logout: () =>
    Effect.gen(function* () {
      const { session } = yield* Auth;
      // The session ID can be considered sensitive. We log that a logout is happening
      // without necessarily logging the ID itself, as the trace context already identifies the request.
      yield* Effect.logInfo({ userId: session!.user_id }, `User initiated logout`);

      yield* deleteSessionEffect(session!.id).pipe(
        Effect.catchAll((err) =>
          // The error object is passed as the cause, which is the correct
          // way to handle structured error logging. The OTLP logger will
          // format this correctly.
          Effect.logError("Failed to delete session on logout", err)
        ),
      );
    }),
});
