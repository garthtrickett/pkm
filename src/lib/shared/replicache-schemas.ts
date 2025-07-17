// src/lib/shared/replicache-schemas.ts
import { Schema } from "effect";
import { BlockSchema, NoteSchema } from "./schemas";

// --- PULL ---
export const PullRequestSchema = Schema.Struct({
  clientGroupID: Schema.String,
  cookie: Schema.Union(Schema.Number, Schema.Null),
  schemaVersion: Schema.String,
});
export type PullRequest = Schema.Schema.Type<typeof PullRequestSchema>;

const PatchOperationSchema = Schema.Union(
  Schema.Struct({ op: Schema.Literal("clear") }),
  Schema.Struct({
    op: Schema.Literal("put"),
    key: Schema.String,
    value: Schema.Union(NoteSchema, BlockSchema),
  }),
  Schema.Struct({ op: Schema.Literal("del"), key: Schema.String }),
);

export const PullResponseSchema = Schema.Struct({
  cookie: Schema.Number,
  lastMutationID: Schema.Number,
  patch: Schema.Array(PatchOperationSchema),
});
export type PullResponse = Schema.Schema.Type<typeof PullResponseSchema>;

const MutationSchema = Schema.Struct({
  id: Schema.Number,
  name: Schema.String,
  args: Schema.Any, // Or a more specific schema for your mutator args
});

export const PushRequestSchema = Schema.Struct({
  clientGroupID: Schema.String,
  mutations: Schema.Array(MutationSchema),
});
export type PushRequest = Schema.Schema.Type<typeof PushRequestSchema>;
