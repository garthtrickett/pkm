// src/features/user/user.http.ts
import {
  HttpServerRequest,
  HttpServerResponse,
  Multipart,
} from "@effect/platform";
import { Effect } from "effect";
import { Db } from "../../db/DbTag";
import { Auth, httpAuthMiddleware } from "../../lib/server/auth";
import { S3Uploader } from "../../lib/server/s3";
import { UserApi } from "../../lib/shared/user-api";
import { HttpRouter } from "@effect/platform";

// ✅ EXPORT the router directly.
export const UserHttpRoutes = HttpRouter.empty.pipe(
  HttpRouter.post(
    "/api/user/avatar",
    Effect.gen(function* () {
      const request = yield* HttpServerRequest.HttpServerRequest;
      const { user } = yield* Auth;

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
  // This middleware requires the Db service, which we'll provide in bun-server.ts
  HttpRouter.use(httpAuthMiddleware),
);
