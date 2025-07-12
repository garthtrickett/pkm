// src/client.ts
import { FetchHttpClient } from "@effect/platform";
import { RpcClient, RpcSerialization } from "@effect/rpc";
import { Effect, Layer } from "effect";
import { RpcAuth } from "./api";

// Use a relative URL to let the Vite proxy handle it
const ProtocolLive = RpcClient.layerProtocolHttp({
  url: "/api/rpc", // Changed
}).pipe(Layer.provide([FetchHttpClient.layer, RpcSerialization.layerNdjson]));

export class RpcAuthClient extends Effect.Service<RpcAuthClient>()(
  "RpcAuthClient",
  {
    dependencies: [ProtocolLive],
    scoped: RpcClient.make(RpcAuth),
  },
) {}

// Export the main effect instead of running it
export const mainEffect = Effect.gen(function* () {
  // Renamed and exported
  const client = yield* RpcAuthClient;
  return yield* client
    .SignUpRequest({
      email: "test@test.com",
      password: "test",
    })
    .pipe(
      Effect.tapError((requestError) => Effect.log(requestError.errorMessage)),
    );
}).pipe(Effect.provide(RpcAuthClient.Default));
