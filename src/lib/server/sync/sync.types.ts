// src/lib/server/sync/sync.types.ts
import type { Transaction } from "kysely";
import type { Effect } from "effect";
import { Schema } from "effect";
import type { Database } from "../../../types";
import type { PullResponse } from "../../shared/replicache-schemas";
import { BlockIdSchema, NoteIdSchema, type UserId } from "../../shared/schemas";

/**
 * Defines the shape of the data stored in the `client_view_record`'s `data` column.
 * This schema ensures type safety when reading from and writing to the CVR.
 */
export const CvrDataSchema = Schema.Struct({
  notes: Schema.Array(NoteIdSchema),
  blocks: Schema.Array(BlockIdSchema),
  // To add a new syncable entity, add its ID array here. e.g.,
  // tags: Schema.Array(TagIdSchema),
});
export type CvrData = Schema.Schema.Type<typeof CvrDataSchema>;

/**
 * The contract that any syncable data type must adhere to.
 * This allows the central pull logic to be completely agnostic of the data it's syncing.
 */
export interface SyncableEntity {
  /** The key this entity's IDs will be stored under in the CVR `data` field. */
  readonly keyInCVR: keyof CvrData;

  /** An Effect that fetches all current IDs for this entity type for a given user. */
  readonly getAllIds: (
    trx: Transaction<Database>,
    userId: UserId,
  ) => Effect.Effect<string[]>;

  /** An Effect that calculates the patch operations (put, del) for this entity. */
  readonly getPatchOperations: (
    trx: Transaction<Database>,
    userId: UserId,
    lastPullTimestamp: Date,
    oldCVRData: CvrData | undefined,
    newIds: ReadonlySet<string>,
  ) => Effect.Effect<PullResponse["patch"]>;
}
