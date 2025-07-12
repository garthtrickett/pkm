import { Context, Effect, Layer, Ref } from "effect";

export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

export interface ILogConfig {
  readonly logLevel: Ref.Ref<LogLevel>;
}

export class LogConfig extends Context.Tag("LogConfig")<
  LogConfig,
  ILogConfig
>() {}

export const LogConfigLive = Layer.effect(
  LogConfig,
  Effect.map(Ref.make<LogLevel>("info"), (logLevel) => ({ logLevel })),
);

export const getEffectiveLogLevel = (): Effect.Effect<
  LogLevel,
  never,
  LogConfig
> =>
  Effect.gen(function* () {
    const overrideLevel = process.env.LOG_LEVEL_OVERRIDE as
      | LogLevel
      | undefined;
    if (overrideLevel) {
      return overrideLevel;
    }
    return yield* Effect.flatMap(LogConfig, (service) =>
      Ref.get(service.logLevel),
    );
  });
