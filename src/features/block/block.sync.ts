// src/features/block/block.sync.ts
import { Effect } from "effect";
import type { Transaction } from "kysely";
import type { Database } from "../../types";
import type { SyncableEntity } from "../../lib/server/sync/sync.types";
import type { UserId } from "../../lib/shared/schemas";
import type { PullResponse } from "../../lib/shared/replicache-schemas";

/**
 * The sync handler for the 'block' entity.
 * It knows how to fetch all block IDs and calculate changes for blocks.
 */
export const blockSyncHandler: SyncableEntity = {
  keyInCVR: "blocks",

  getAllIds: (trx: Transaction<Database>, userId: UserId) =>
    Effect.promise(() =>
      trx
        .selectFrom("block")
        .select("id")
        .where("user_id", "=", userId)
        .execute(),
    ).pipe(Effect.map((rows) => rows.map((r) => r.id))),

  getPatchOperations: (trx, userId, lastPullTimestamp, oldCVRData, newIds) =>
    Effect.gen(function* () {
      const patch: PullResponse["patch"] = [];

      // 1. Handle creations and updates
      const changedBlocks = yield* Effect.promise(() =>
        trx
          .selectFrom("block")
          .selectAll()
          .where("user_id", "=", userId)
          .where("updated_at", ">", lastPullTimestamp)
          .execute(),
      );

      for (const block of changedBlocks) {
        // ✅ FIX: Construct the value object directly to match the client's expected schema.
        patch.push({
          op: "put",
          key: `block/${block.id}`,
          value: {
            _tag: "block",
            id: block.id,
            user_id: block.user_id,
            note_id: block.note_id,
            type: block.type,
            content: block.content,
            fields: block.fields ?? {},
            tags: block.tags,
            links: block.links,
            file_path: block.file_path,
            parent_id: block.parent_id,
            depth: block.depth,
            order: block.order,
            transclusions: block.transclusions,
            version: block.version,
            created_at: block.created_at.toISOString(),
            updated_at: block.updated_at.toISOString(),
          },
        });
      }

      // 2. Handle deletions
      if (oldCVRData) {
        const oldBlockIds = new Set(oldCVRData.blocks);
        for (const oldId of oldBlockIds) {
          if (!newIds.has(oldId)) {
            patch.push({ op: "del", key: `block/${oldId}` });
          }
        }
      }

      return patch;
    }),
};
