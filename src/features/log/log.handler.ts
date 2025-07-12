// src/features/log/log.handler.ts
import { Effect } from "effect";
import { Logger } from "../../lib/server/logger.server"; // Server-only import
import { RpcLog } from "../../lib/shared/log-schema"; // Shared schema import

/**
 * A robust stringifier for unknown values to satisfy the linter and prevent '[object Object]'.
 * @param value The value to stringify.
 * @returns A string representation of the value.
 */
const safeStringify = (value: unknown): string => {
  // Handle null and undefined explicitly
  if (value === null) {
    return "null";
  }
  if (value === undefined) {
    return "undefined";
  }

  // Handle primitive types that are safe with String()
  switch (typeof value) {
    case "string":
      return value;
    case "number":
    case "boolean":
    case "bigint":
    case "symbol":
      return value.toString();
  }

  // For any 'object' type (including arrays, plain objects, etc.), use JSON.stringify
  // with a safe fallback for circular references.
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "[Unserializable Object]";
    }
  }

  // This should be unreachable, but provides a fallback.
  return "[Unknown Type]";
};

// The handler implementation for the RpcLog group
export const RpcLogLayer = RpcLog.toLayer({
  log: (payload) =>
    Effect.gen(function* () {
      const logger = yield* Logger;

      // ✅ FIX: Use the new safeStringify helper function.
      const message = payload.args.map(safeStringify).join(" ");

      logger[payload.level]({ clientMessage: message }, "[CLIENT LOG]");
    }),
});
