// src/features/user/user.http.ts

import {
  HttpServerRequest,
  HttpServerResponse,
  Multipart,
  HttpRouter, // Import HttpRouter
} from "@effect/platform";
import { Effect } from "effect";
import { Db } from "../../db/DbTag";
import { Auth } from "../../lib/server/auth"; // Only import the Auth service, not the middleware
import { S3Uploader } from "../../lib/server/s3";
import { UserApi } from "../../lib/shared/user-api";

// ✅ CHANGE: Export a clean router without any middleware applied.
// Its handlers will now require `Auth`, `Db`, and `S3Uploader`.
export const UserHttpRoutes = HttpRouter.empty.pipe(
  HttpRouter.post(
    "/avatar", // Note: the path is now relative to where it will be mounted
    Effect.gen(function* () {
      const request = yield* HttpServerRequest.HttpServerRequest;
      const { user } = yield* Auth; // The handler still needs the Auth context

      const persisted = yield* request.multipart.pipe(
        Effect.catchTag("MultipartError", (error) =>
          Effect.fail(
            HttpServerResponse.text(
              `Multipart processing failed: ${error.reason}`,
              { status: 400 },
            ),
          ),
        ),
      );

      const files = persisted.avatar;
      if (
        !files ||
        !Array.isArray(files) ||
        files.length === 0 ||
        !Multipart.isPersistedFile(files[0])
      ) {
        return yield* Effect.fail(
          HttpServerResponse.text(
            "Missing or invalid 'avatar' file in form data.",
            { status: 400 },
          ),
        );
      }
      const avatarFile = files[0];

      const s3Uploader = yield* S3Uploader;
      const newAvatarUrl = yield* s3Uploader.uploadAvatar(user!.id, avatarFile);

      const db = yield* Db;
      yield* Effect.promise(() =>
        db
          .updateTable("user")
          .set({ avatar_url: newAvatarUrl })
          .where("id", "=", user!.id)
          .execute(),
      );
      return yield* HttpServerResponse.schemaJson(
        UserApi.uploadAvatarResponseSchema,
      )({ avatarUrl: newAvatarUrl });
    }),
  ),
);
