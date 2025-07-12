// src/client.ts
import { BrowserHttpClient } from "@effect/platform-browser";
import { RpcClient, RpcSerialization } from "@effect/rpc";
import { Effect, Layer } from "effect";
import { RequestError, RpcAuth } from "./api";
import { RpcLog } from "./log-schema"; // <-- FIX: Import from the schema-only file
import type { LogLevel } from "./lib/shared/logConfig";

const ProtocolLive = RpcClient.layerProtocolHttp({
  url: "/api/rpc",
}).pipe(
  Layer.provide([
    BrowserHttpClient.layerXMLHttpRequest,
    RpcSerialization.layerNdjson,
  ]),
);

export class RpcAuthClient extends Effect.Service<RpcAuthClient>()(
  "RpcAuthClient",
  {
    dependencies: [ProtocolLive],
    scoped: RpcClient.make(RpcAuth),
  },
) {}

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

// The main application effect
export const mainEffect = Effect.gen(function* () {
  const client = yield* RpcAuthClient;
  const appDiv = document.getElementById("app")!;

  yield* clientLog("info", "Client app started. Preparing RPC call...");

  yield* client
    .SignUpRequest({
      email: "test@test.com",
      password: "test",
    })
    .pipe(
      Effect.match({
        // FIX: Handle the union of the business error and the transport error.
        onFailure: (error: RequestError | Error) => {
          const tag =
            typeof error === "object" && error && "_tag" in error
              ? String((error as { _tag: unknown })._tag)
              : "UnknownError";
          appDiv.innerText = `❌ Error: ${tag}`;
          return clientLog("error", "SignUpRequest failed", error);
        },
        onSuccess: (response) => {
          appDiv.innerText = `✅ Server responded: ${response}`;
          return clientLog("info", "SignUpRequest succeeded", { response });
        },
      }),
    );
}).pipe(
  Effect.provide(Layer.merge(RpcAuthClient.Default, RpcLogClient.Default)),
);
