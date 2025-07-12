// src/server.ts
import { Effect } from "effect";
import { RpcAuth } from "./lib/shared/api";

// The temporary LoggerLayer has been removed.

// This implementation layer is imported and used by bun-server.ts
export const RpcAuthLayer = RpcAuth.toLayer({
  SignUpRequest: (params) =>
    Effect.gen(function* () {
      // Effect.log now uses the globally provided Pino logger.
      // We add annotations for structured logging.
      yield* Effect.log(
        `Handling SignUpRequest for email: ${params.email}`,
      ).pipe(
        Effect.annotateLogs({
          passwordLength: params.password.length,
          module: "RpcAuth",
        }),
      );
      return true;
    }),
});
