// src/features/note/note.sync.ts
import { Effect, Schema } from "effect";
import type { Transaction } from "kysely";
import type { Database } from "../../types";
import type { SyncableEntity } from "../../lib/server/sync/sync.types";
import type { UserId } from "../../lib/shared/schemas";
import { TiptapDocSchema } from "../../lib/shared/schemas";
import type { PullResponse } from "../../lib/shared/replicache-schemas";

/**
 * The sync handler for the 'note' entity.
 * It knows how to fetch all note IDs and calculate changes for notes.
 */
export const noteSyncHandler: SyncableEntity = {
  keyInCVR: "notes",

  getAllIds: (trx: Transaction<Database>, userId: UserId) =>
    Effect.promise(() =>
      trx
        .selectFrom("note")
        .select("id")
        .where("user_id", "=", userId)
        .execute(),
    ).pipe(Effect.map((rows) => rows.map((r) => r.id))),

  getPatchOperations: (trx, userId, lastPullTimestamp, oldCVRData, newIds) =>
    Effect.gen(function* () {
      const patch: PullResponse["patch"] = [];

      // 1. Handle creations and updates
      const changedNotes = yield* Effect.promise(() =>
        trx
          .selectFrom("note")
          .selectAll()
          .where("user_id", "=", userId)
          .where("updated_at", ">", lastPullTimestamp)
          .execute(),
      );

      for (const note of changedNotes) {
        // ✅ FIX: Decode the `unknown` content from the database into the specific
        // TiptapDoc type. This validates the data and removes the unsafe `any` cast.
        const decodedContent = Schema.decodeUnknownSync(TiptapDocSchema)(
          note.content,
        );

        patch.push({
          op: "put",
          key: `note/${note.id}`,
          value: {
            _tag: "note",
            id: note.id,
            user_id: note.user_id,
            title: note.title,
            content: decodedContent, // Use the safely decoded content
            version: note.version,
            created_at: note.created_at.toISOString(),
            updated_at: note.updated_at.toISOString(),
          },
        });
      }

      // 2. Handle deletions
      if (oldCVRData) {
        const oldNoteIds = new Set(oldCVRData.notes);
        for (const oldId of oldNoteIds) {
          if (!newIds.has(oldId)) {
            patch.push({ op: "del", key: `note/${oldId}` });
          }
        }
      }

      return patch;
    }),
};
