// src/client.ts
import { BrowserHttpClient } from "@effect/platform-browser"; // Changed import
import { RpcClient, RpcSerialization } from "@effect/rpc";
import { Effect, Layer } from "effect";
import { RpcAuth } from "./api";

// Use the browser-specific XMLHttpRequest layer
const ProtocolLive = RpcClient.layerProtocolHttp({
  url: "/api/rpc",
}).pipe(
  Layer.provide([
    BrowserHttpClient.layerXMLHttpRequest, // Use the idiomatic browser client
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

// The main effect now includes the logic to update the DOM
export const mainEffect = Effect.gen(function* () {
  const client = yield* RpcAuthClient;
  const appDiv = document.getElementById("app")!;

  // Use Effect.match to handle success and failure declaratively
  yield* client
    .SignUpRequest({
      email: "test@test.com",
      password: "test",
    })
    .pipe(
      Effect.match({
        onFailure: (error) => {
          // This logic now lives inside the effect
          const tag =
            typeof error === "object" && error && "_tag" in error
              ? String((error as { _tag: unknown })._tag)
              : "UnknownError";
          appDiv.innerText = `❌ Error: ${tag}`;
          console.error("Error:", error);
        },
        onSuccess: (response) => {
          // This logic also lives inside the effect
          appDiv.innerText = `✅ Server responded: ${response}`;
          console.info("Success:", response);
        },
      }),
    );
}).pipe(Effect.provide(RpcAuthClient.Default));
