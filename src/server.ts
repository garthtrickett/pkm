// src/server.ts
import { Effect, Layer, Logger } from "effect";
import { RpcAuth } from "./api";
import { AuthMiddleware } from "./middleware";
import { User } from "./user";

// Implement the middleware for the server
export const AuthLive = Layer.succeed(
  AuthMiddleware,
  AuthMiddleware.of(({ headers, payload, rpc }) =>
    Effect.succeed(new User({ id: "123", name: "Logged in user" })),
  ),
);

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
}).pipe(Layer.provide(LoggerLayer)); // Provide the new AuthLive middleware layer
