// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ReplicacheClientGroupId } from './ReplicacheClientGroup';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.replicache_client */
export type ReplicacheClientId = string & { __brand: 'public.replicache_client' };

/** Represents the table public.replicache_client */
export default interface ReplicacheClientTable {
  id: ColumnType<ReplicacheClientId, ReplicacheClientId, ReplicacheClientId>;

  client_group_id: ColumnType<ReplicacheClientGroupId, ReplicacheClientGroupId, ReplicacheClientGroupId>;

  last_mutation_id: ColumnType<number, number | undefined, number>;

  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type ReplicacheClient = Selectable<ReplicacheClientTable>;

export type NewReplicacheClient = Insertable<ReplicacheClientTable>;

export type ReplicacheClientUpdate = Updateable<ReplicacheClientTable>;
