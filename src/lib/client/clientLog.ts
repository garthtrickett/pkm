// src/lib/client/clientLog.ts
import { RpcClient, RpcSerialization } from "@effect/rpc";
import { Effect, Layer } from "effect";
import { RpcLog } from "../shared/log-schema";
import type { LogLevel } from "../shared/logConfig";

const ProtocolLive = RpcClient.layerProtocolHttp({
  url: "/api/rpc",
}).pipe(
  // Use the standard FetchHttpClient. It will be provided globally by ClientLive.
  Layer.provide(RpcSerialization.layerJson),
);

export class RpcLogClient extends Effect.Service<RpcLogClient>()(
  "RpcLogClient",
  {
    dependencies: [ProtocolLive],
    scoped: RpcClient.make(RpcLog),
  },
) {}

export const clientLog = (
  level: Exclude<LogLevel, "silent">,
  ...args: unknown[]
): Effect.Effect<void, Error, RpcLogClient> =>
  Effect.gen(function* () {
    const client = yield* RpcLogClient;
    yield* client.log({ level, args }).pipe(
      Effect.catchAll((err) =>
        Effect.sync(() => console.error("Failed to send log:", err)),
      ),
      Effect.forkDaemon,
    );
  });
