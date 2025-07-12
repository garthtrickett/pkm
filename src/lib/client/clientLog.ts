// src/client.ts
import { BrowserHttpClient } from "@effect/platform-browser";
import { RpcClient, RpcSerialization } from "@effect/rpc";
import { Effect, Layer } from "effect";
import { RpcLog } from "../shared/log-schema"; // <-- FIX: Import from the schema-only file
import type { LogLevel } from "../shared/logConfig";

const ProtocolLive = RpcClient.layerProtocolHttp({
  url: "/api/rpc",
}).pipe(
  Layer.provide([
    BrowserHttpClient.layerXMLHttpRequest,
    RpcSerialization.layerNdjson,
  ]),
);


export class RpcLogClient extends Effect.Service<RpcLogClient>()(
  "RpcLogClient",
  {
    dependencies: [ProtocolLive],
    scoped: RpcClient.make(RpcLog),
  },
) {}

// The "log" RPC can only fail with a transport error.
export const clientLog = (
  level: Exclude<LogLevel, "silent">,
  ...args: unknown[]
): Effect.Effect<void, Error, RpcLogClient> => // <-- FIX: Use correct error type
  Effect.gen(function* () {
    const client = yield* RpcLogClient;
    yield* client.log({ level, args }).pipe(
      Effect.catchAll((err) =>
        Effect.sync(() => console.error("Failed to send log:", err)),
      ),
      Effect.forkDaemon,
    );
  });

