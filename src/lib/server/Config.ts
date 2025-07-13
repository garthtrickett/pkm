import { Config as EffectConfig, Context, Layer, Option, pipe, Redacted } from "effect";

// --- Sub-configs for modularity ---

const NeonConfig = pipe(
  EffectConfig.all({
    // Treat the source URLs as secrets from the start
    url: EffectConfig.redacted(EffectConfig.string("DATABASE_URL")),
    localUrl: EffectConfig.option(
      EffectConfig.redacted(EffectConfig.string("DATABASE_URL_LOCAL")),
    ),
    useLocalProxy: pipe(
      EffectConfig.boolean("USE_LOCAL_NEON_PROXY"),
      EffectConfig.withDefault(false),
    ),
  }),
  // Map over the config to derive the final connection string
  EffectConfig.map(({ url, localUrl, useLocalProxy }) => {
    // Derive the final string, unwrapping the Redacted values for the logic
    const finalUrlString = pipe(
      localUrl, // Option<Redacted<string>>
      Option.filter(() => useLocalProxy),
      Option.map(Redacted.value), // Get string from Option<Redacted<string>>
      Option.getOrElse(() => Redacted.value(url)), // Get string from Redacted<string>
    );

    return {
      // ✅ Re-wrap the derived plain string into a Redacted value
      connectionString: Redacted.make(finalUrlString),
      useLocalProxy,
    };
  }),
);
const S3Config = EffectConfig.all({
  bucketName: EffectConfig.string("BUCKET_NAME"),
  publicAvatarUrl: EffectConfig.string("PUBLIC_AVATAR_URL"),
  endpointUrl: EffectConfig.string("AWS_ENDPOINT_URL_S3"),
  // FIX: Replace deprecated `secret` with `redacted`
  accessKeyId: EffectConfig.redacted("AWS_ACCESS_KEY_ID"),
  secretAccessKey: EffectConfig.redacted("AWS_SECRET_ACCESS_KEY"),
  region: EffectConfig.string("AWS_REGION"),
});

const LogtailConfig = EffectConfig.all({
  // FIX: Replace deprecated `secret` with `redacted`
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

const AppConfigObject = EffectConfig.all({
  neon: NeonConfig,
  s3: S3Config,
  logtail: LogtailConfig,
  app: AppInfoConfig,
});

export class Config extends Context.Tag("app/Config")<
  Config,
  EffectConfig.Config.Success<typeof AppConfigObject>
>() {}

export const ConfigLive = Layer.effect(Config, AppConfigObject);
