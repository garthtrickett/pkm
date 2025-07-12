// src/client.ts
import { FetchHttpClient, Headers } from "@effect/platform";
import { RpcClient, RpcMiddleware, RpcSerialization } from "@effect/rpc";
import { Effect, Layer } from "effect";
import { RpcAuth } from "./api";
import { AuthMiddleware } from "./middleware";

// Implement the middleware for the client
const AuthClientLive: Layer.Layer<RpcMiddleware.ForClient<AuthMiddleware>> =
  RpcMiddleware.layerClient(AuthMiddleware, ({ request, rpc }) =>
    Effect.succeed({
      ...request,
      headers: Headers.set(request.headers, "authorization", "Bearer token"),
    }),
  );

// Use a relative URL to let the Vite proxy handle it
const ProtocolLive = RpcClient.layerProtocolHttp({
  url: "/api/rpc", // Changed
}).pipe(
  Layer.provide([
    FetchHttpClient.layer,
    RpcSerialization.layerNdjson,
    AuthClientLive, // Add the middleware layer
  ]),
);
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
