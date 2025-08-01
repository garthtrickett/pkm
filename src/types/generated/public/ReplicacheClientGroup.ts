// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.replicache_client_group */
export type ReplicacheClientGroupId = string & { __brand: 'public.replicache_client_group' };

/** Represents the table public.replicache_client_group */
export default interface ReplicacheClientGroupTable {
  id: ColumnType<ReplicacheClientGroupId, ReplicacheClientGroupId, ReplicacheClientGroupId>;

  user_id: ColumnType<string, string, string>;

  cvr_version: ColumnType<number, number | undefined, number>;

  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type ReplicacheClientGroup = Selectable<ReplicacheClientGroupTable>;

export type NewReplicacheClientGroup = Insertable<ReplicacheClientGroupTable>;

export type ReplicacheClientGroupUpdate = Updateable<ReplicacheClientGroupTable>;
