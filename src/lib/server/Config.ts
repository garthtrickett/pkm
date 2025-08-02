// src/lib/server/Config.ts

import {
  Config as EffectConfig,
  Context,
  Layer,
  Option,
  pipe,
  Redacted,
} from "effect";

// --- Sub-configs for modularity ---

const NeonConfig = pipe(
  EffectConfig.all({
    url: EffectConfig.redacted(EffectConfig.string("DATABASE_URL")),
    localUrl: EffectConfig.option(
      EffectConfig.redacted(EffectConfig.string("DATABASE_URL_LOCAL")),
    ),
    useLocalProxy: pipe(
      EffectConfig.boolean("USE_LOCAL_NEON_PROXY"),
      EffectConfig.withDefault(false),
    ),
  }),
  EffectConfig.map(({ url, localUrl, useLocalProxy }) => {
    const finalUrlString = pipe(
      localUrl,
      Option.filter(() => useLocalProxy),
      Option.map(Redacted.value),
      Option.getOrElse(() => Redacted.value(url)),
    );
    return {
      connectionString: Redacted.make(finalUrlString),
      useLocalProxy,
    };
  }),
);

const S3Config = EffectConfig.all({
  bucketName: EffectConfig.string("BUCKET_NAME"),
  publicAvatarUrl: EffectConfig.string("PUBLIC_AVATAR_URL"),
  endpointUrl: EffectConfig.string("AWS_ENDPOINT_URL_S3"),
  accessKeyId: EffectConfig.redacted("AWS_ACCESS_KEY_ID"),
  secretAccessKey: EffectConfig.redacted("AWS_SECRET_ACCESS_KEY"),
  region: EffectConfig.string("AWS_REGION"),
});

const LogtailConfig = EffectConfig.all({
  sourceToken: EffectConfig.redacted("LOGTAIL_SOURCE_TOKEN"),
});

const AppInfoConfig = EffectConfig.all({
  nodeEnv: pipe(
    EffectConfig.string("NODE_ENV"),
    EffectConfig.withDefault("development"),
  ),
  isProduction: EffectConfig.map(
    EffectConfig.string("NODE_ENV"),
    (env) => env === "production",
  ),
});

const JwtConfig = EffectConfig.all({
  secret: EffectConfig.redacted("JWT_SECRET"),
});

const AppConfigObject = EffectConfig.all({
  neon: NeonConfig,
  s3: S3Config,
  logtail: LogtailConfig,
  app: AppInfoConfig,
  jwt: JwtConfig,
});

export class Config extends Context.Tag("app/Config")<
  Config,
  EffectConfig.Config.Success<typeof AppConfigObject>
>() {}

// ✅ FIX: A `Config<A>` object is already an `Effect`.
// We can pass it directly to `Layer.effect`.
export const ConfigLive = Layer.effect(Config, AppConfigObject);
