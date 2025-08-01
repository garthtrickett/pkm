// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { UserId } from './User';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.note */
export type NoteId = string & { __brand: 'public.note' };

/** Represents the table public.note */
export default interface NoteTable {
  id: ColumnType<NoteId, NoteId | undefined, NoteId>;

  user_id: ColumnType<UserId, UserId, UserId>;

  title: ColumnType<string, string, string>;

  content: ColumnType<unknown, unknown, unknown>;

  version: ColumnType<number, number | undefined, number>;

  created_at: ColumnType<Date, Date | string | undefined, Date | string>;

  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type Note = Selectable<NoteTable>;

export type NewNote = Insertable<NoteTable>;

export type NoteUpdate = Updateable<NoteTable>;
