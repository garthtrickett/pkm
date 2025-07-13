// src/features/log/log.handler.ts
import { RpcLog } from "../../lib/shared/log-schema"; // Shared schema import
import { Effect } from "effect";


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

export const RpcLogLayer = RpcLog.toLayer({
  log: (payload) =>
    Effect.gen(function* () {
      const message = payload.args.map(safeStringify).join(" ");

      // Use the global Effect logger. It will automatically be routed
      // to your OTLP endpoint by the ObservabilityLive layer.
      return yield* Effect.log(message);
    }),
});
