// src/lib/shared/schemas.ts
import { Schema } from "effect";

import type { NoteId, Note } from "../../types/generated/public/Note";
import type { UserId, User } from "../../types/generated/public/User"; // Original import
import type { BlockId, Block } from "../../types/generated/public/Block";

// Re-export the database types so other modules can use them.
export type { User, Note, Block, UserId, NoteId, BlockId };

const LenientDateSchema = Schema.Union(
  Schema.DateFromSelf,
  Schema.DateFromString,
);

const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i;
const UUIDSchemaBase = Schema.String.pipe(
  Schema.pattern(uuidRegex, {
    identifier: "UUID",
    description: "a Universally Unique Identifier",
  }),
);
export const NoteIdSchema: Schema.Schema<NoteId, string, never> = (
  UUIDSchemaBase as unknown as Schema.Schema<NoteId, string, never>
).pipe(Schema.annotations({ message: () => "Invalid Note ID format." }));

export const UserIdSchema: Schema.Schema<UserId, string, never> = (
  UUIDSchemaBase as unknown as Schema.Schema<UserId, string, never>
).pipe(Schema.annotations({ message: () => "Invalid User ID format." }));

export const BlockIdSchema: Schema.Schema<BlockId, string, never> = (
  UUIDSchemaBase as unknown as Schema.Schema<BlockId, string, never>
).pipe(Schema.annotations({ message: () => "Invalid Block ID format." }));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const NoteSchema: Schema.Schema<Note, any> = Schema.Struct({
  id: NoteIdSchema,
  user_id: UserIdSchema,
  title: Schema.String,
  content: Schema.String,
  created_at: LenientDateSchema,
  updated_at: LenientDateSchema,
  version: Schema.Number,
});

export const NotesSchema = Schema.Array(NoteSchema);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserSchema: Schema.Schema<User, any> = Schema.Struct({
  id: UserIdSchema,
  email: Schema.String.pipe(
    Schema.pattern(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    ),
  ),
  password_hash: Schema.String,
  created_at: LenientDateSchema,
  permissions: Schema.Union(
    Schema.mutable(Schema.Array(Schema.String)),
    Schema.Null,
  ),
  avatar_url: Schema.Union(Schema.String, Schema.Null),
  email_verified: Schema.Boolean,
});

/**
 * A version of the User schema that is safe to send to the client.
 * It omits the sensitive password_hash.
 */
export const PublicUserSchema = UserSchema.pipe(Schema.omit("password_hash"));
export type PublicUser = typeof PublicUserSchema.Type;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BlockSchema: Schema.Schema<Block, any> = Schema.Struct({
  id: BlockIdSchema,
  user_id: UserIdSchema,
  note_id: Schema.Union(NoteIdSchema, Schema.Null),
  type: Schema.String,
  content: Schema.String,
  fields: Schema.Any,
  tags: Schema.mutable(Schema.Array(Schema.String)),
  links: Schema.mutable(Schema.Array(Schema.String)),
  file_path: Schema.String,
  parent_id: Schema.Union(BlockIdSchema, Schema.Null),
  depth: Schema.Number,
  order: Schema.Number,
  transclusions: Schema.mutable(Schema.Array(Schema.String)),
  version: Schema.Number,
  created_at: LenientDateSchema,
  updated_at: LenientDateSchema,
});
