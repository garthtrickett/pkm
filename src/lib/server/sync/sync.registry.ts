// src/lib/server/sync/sync.registry.ts
import { blockSyncHandler } from "../../../features/block/block.sync";
import { noteSyncHandler } from "../../../features/note/note.sync";
import type { SyncableEntity } from "./sync.types";

/**
 * A central registry of all data types that can be synced with Replicache.
 * To add a new syncable entity, create a handler that implements the SyncableEntity
 * interface and add it to this array. The pull logic will handle the rest automatically.
 */
export const syncableEntities: readonly SyncableEntity[] = [
  noteSyncHandler,
  blockSyncHandler,
];
