import logtail from "@logtail/pino";
import { Effect, Layer, Context } from "effect";
import type { DestinationStream, Logger as PinoLogger } from "pino";
import pino from "pino";
import pretty from "pino-pretty";
import { getEffectiveLogLevel, LogConfigLive } from "../shared/logConfig";

const createLoggerEffect = Effect.gen(function* () {
  const env = process.env.NODE_ENV ?? "development";

  // --- FIX STARTS HERE ---
  // Use Effect.if to handle the conditional logic.
  // Both onTrue and onFalse branches now return an Effect.
  const stream = yield* Effect.if(env === "production", {
    onTrue: () =>
      Effect.tryPromise({
        try: () =>
          logtail({
            sourceToken: process.env.LOGTAIL_SOURCE_TOKEN!,
            options: {
              sendLogsToBetterStack: true,
              endpoint: "https://s1238029.eu-nbg-2.betterstackdata.com",
            },
          }),
        catch: (e) =>
          new Error("Failed to create BetterStack log stream", { cause: e }),
      }),
    onFalse: () =>
      Effect.succeed(pretty({ colorize: true }) as DestinationStream),
  });
  // --- FIX ENDS HERE ---

  const level = yield* getEffectiveLogLevel();

  const pinoOptions = {
    level,
    redact: {
      paths: ["email", "password", "token", "sessionId"],
      censor: "[REDACTED]",
    },
  };

  return pino(pinoOptions, stream);
});

export class Logger extends Context.Tag("Logger")<Logger, PinoLogger>() {}

export const LoggerLive = Layer.effect(Logger, createLoggerEffect).pipe(
  Layer.provide(LogConfigLive),
);

export function serverLog(
  level: "info" | "error" | "warn" | "debug",
  data: object,
  message: string,
): Effect.Effect<void, never, Logger> {
  return Effect.gen(function* () {
    const logger = yield* Logger;
    logger[level](data, message);
  });
}
