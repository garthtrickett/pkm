// FILE: ./src/lib/client/clientLog.ts
import { Effect } from "effect";
import type { LogLevel } from "../shared/logConfig";
import { RpcLogClient } from "./rpc"; // ✅ FIX: Import the canonical client

export const clientLog = (
  level: Exclude<LogLevel, "silent">,
  ...args: unknown[]
): Effect.Effect<void, never, RpcLogClient> =>
  Effect.gen(function* () {
    const client = yield* RpcLogClient;
    yield* client.log({ level, args }).pipe(
      Effect.catchAll((err) =>
        Effect.sync(() => console.error("Failed to send log:", err)),
      ),
      Effect.forkDaemon,
    );
  });
