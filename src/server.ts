// src/server.ts
import { Effect, Layer, Logger } from "effect";
import { RpcAuth } from "./api";

// This custom logger is still in use
export const LoggerLayer = Logger.add(
  Logger.make(({ logLevel, message }) => {
    globalThis.console.log(`[${logLevel.label}] ${String(message)}`);
  }),
);

// This implementation layer is imported and used by bun-server.ts
export const RpcAuthLayer = RpcAuth.toLayer({
  SignUpRequest: (params) =>
    Effect.gen(function* () {
      yield* Effect.log(params.email, params.password);
      return true;
    }),
}).pipe(Layer.provide(LoggerLayer)); // AuthLive provider is removed
