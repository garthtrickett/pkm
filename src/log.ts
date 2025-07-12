// src/log.ts
import { Effect } from "effect";
import { Logger } from "./lib/server/logger.server"; // Server-only import
import { RpcLog } from "./log-schema"; // Import the schema definition

// The handler implementation for the RpcLog group
export const RpcLogLayer = RpcLog.toLayer({
  log: (payload) =>
    Effect.gen(function* () {
      const logger = yield* Logger;
      const message = payload.args.map(String).join(" ");
      logger[payload.level]({ clientMessage: message }, "[CLIENT LOG]");
    }),
});

// Re-export the schema for convenient use in bun-server.ts
export { RpcLog } from "./log-schema";
