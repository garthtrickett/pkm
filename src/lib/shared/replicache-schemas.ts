// FILE: ./src/lib/shared/replicache-schemas.ts
import { Schema } from "effect";
import { NoteIdSchema, UserIdSchema, BlockIdSchema } from "./schemas";

// --- PULL ---
export const PullRequestSchema = Schema.Struct({
  clientGroupID: Schema.String,
  cookie: Schema.Union(Schema.Number, Schema.Null),
  schemaVersion: Schema.String,
});
export type PullRequest = Schema.Schema.Type<typeof PullRequestSchema>;

const SerializedNoteSchema = Schema.Struct({
  _tag: Schema.Literal("note"),
  id: NoteIdSchema,
  user_id: UserIdSchema,
  title: Schema.String,
  content: Schema.String,
  version: Schema.Number,
  created_at: Schema.String,
  updated_at: Schema.String,
});

const SerializedBlockSchema = Schema.Struct({
  _tag: Schema.Literal("block"),
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
  created_at: Schema.String,
  updated_at: Schema.String,
});

const PatchOperationSchema = Schema.Union(
  Schema.Struct({ op: Schema.Literal("clear") }),
  Schema.Struct({
    op: Schema.Literal("put"),
    key: Schema.String,
    value: Schema.Union(SerializedNoteSchema, SerializedBlockSchema),
  }),
  Schema.Struct({ op: Schema.Literal("del"), key: Schema.String }),
);
export const PullResponseSchema = Schema.Struct({
  cookie: Schema.transform(
    Schema.Union(Schema.Number, Schema.String),
    Schema.Number,
    {
      decode: (input: string | number) => Number(input),
      encode: (output: number) => output,
    },
  ),
  lastMutationIDChanges: Schema.Record({
    key: Schema.String,
    value: Schema.Number,
  }),
  // ✅ THIS IS THE FIX ✅
  // Wrap the Schema.Array in Schema.mutable to produce a mutable array type.
  patch: Schema.mutable(Schema.Array(PatchOperationSchema)),
});
export type PullResponse = Schema.Schema.Type<typeof PullResponseSchema>;

const MutationSchema = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  args: Schema.Any,
});

export const PushRequestSchema = Schema.Struct({
  clientGroupID: Schema.String,
  mutations: Schema.Array(MutationSchema),
});
export type PushRequest = Schema.Schema.Type<typeof PushRequestSchema>;
