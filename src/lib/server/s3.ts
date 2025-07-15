// src/lib/server/s3.ts
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import type { PersistedFile } from "@effect/platform/Multipart";
// ✅ FIX 1: Import the platform-specific FileSystem Layer
import { Context, Data, Effect, Layer, Redacted } from "effect";
import type { UserId } from "../../types/generated/public/User";
import { Config } from "./Config";
import { generateUUID } from "./utils";

// --- Service Definition ---

export class S3UploadError extends Data.TaggedError("S3UploadError")<{
  readonly cause: unknown;
}> {}

export interface IS3Uploader {
  readonly uploadAvatar: (
    userId: UserId,
    file: PersistedFile,
  ) => Effect.Effect<string, S3UploadError>;
}

export class S3Uploader extends Context.Tag("S3Uploader")<
  S3Uploader,
  IS3Uploader
>() {}

// --- Live Implementation ---

export class S3 extends Context.Tag("S3")<S3, S3Client>() {}

export const S3Live = Layer.effect(
  S3,
  Effect.gen(function* () {
    const config = yield* Config;
    const { region, endpointUrl, accessKeyId, secretAccessKey } = config.s3;
    return new S3Client({
      region,
      endpoint: endpointUrl,
      credentials: {
        accessKeyId: Redacted.value(accessKeyId),
        secretAccessKey: Redacted.value(secretAccessKey),
      },
    });
  }),
);

// This layer now depends on FileSystem.
export const S3UploaderLive = Layer.effect(
  S3Uploader,
  Effect.gen(function* () {
    const s3Client = yield* S3;
    const config = yield* Config;
    // The FileSystem service is no longer needed here
    const { bucketName, publicAvatarUrl } = config.s3;

    const uploadAvatar = (
      userId: UserId,
      file: PersistedFile,
    ): Effect.Effect<string, S3UploadError> =>
      Effect.gen(function* () {
        const fileExtension = "webp";
        const key = `avatars/${userId}/${yield* generateUUID()}.${fileExtension}`;

        // ✅ FIX: Use Bun's native file streaming API. This has no Effect
        // context requirement and directly returns a ReadableStream.
        const bodyStream = Bun.file(file.path).stream();

        const upload = new Upload({
          client: s3Client,
          params: {
            Bucket: bucketName,
            Key: key,
            Body: bodyStream,
            ContentType: file.contentType,
          },
        });

        yield* Effect.tryPromise({
          try: () => upload.done(),
          catch: (cause) => new S3UploadError({ cause }),
        });

        return `${publicAvatarUrl}/${key}`;
      });

    return S3Uploader.of({ uploadAvatar });
  }),
).pipe(
  // ✅ We no longer need to provide BunFileSystem.layer here
  Layer.provide(S3Live),
);
