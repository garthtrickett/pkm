// src/lib/shared/schemas.ts
import { Schema } from "effect";

import type { NoteId, Note } from "../../types/generated/public/Note";
import type { UserId, User } from "../../types/generated/public/User";
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

// Define the structure for marks (e.g., links, tags)
const TagMarkSchema = Schema.Struct({
  type: Schema.Literal("tagMark"),
  attrs: Schema.Struct({ tagName: Schema.String }),
});

const LinkMarkSchema = Schema.Struct({
  type: Schema.Literal("linkMark"),
  attrs: Schema.Struct({ linkTarget: Schema.String }),
});

const MarkSchema = Schema.Union(TagMarkSchema, LinkMarkSchema);

// Describes a simple text node inside a paragraph, now including marks
export const TiptapTextNodeSchema = Schema.Struct({
  type: Schema.Literal("text"),
  text: Schema.String,
  marks: Schema.optional(Schema.Array(MarkSchema)),
});

export type TiptapTextNode = Schema.Schema.Type<typeof TiptapTextNodeSchema>;

// Describes a paragraph node, which contains text nodes
export const TiptapParagraphNodeSchema = Schema.Struct({
  type: Schema.Literal("paragraph"),
  content: Schema.optional(Schema.Array(TiptapTextNodeSchema)),
});
export type TiptapParagraphNode = Schema.Schema.Type<
  typeof TiptapParagraphNodeSchema
>;

// Add this new schema for heading nodes
export const TiptapHeadingNodeSchema = Schema.Struct({
  type: Schema.Literal("heading"),
  attrs: Schema.Struct({ level: Schema.Number }),
  content: Schema.optional(Schema.Array(TiptapTextNodeSchema)),
});
export type TiptapHeadingNode = Schema.Schema.Type<
  typeof TiptapHeadingNodeSchema
>;

// --- Strengthened Recursive Schemas ---

// 1. Forward-declare interfaces for recursive types to break circular dependencies.
export interface TiptapListItemNode {
  readonly type: "listItem";
  readonly content: ReadonlyArray<
    TiptapParagraphNode | TiptapBulletListNode | TiptapHeadingNode
  >;
}

export interface TiptapBulletListNode {
  readonly type: "bulletList";
  readonly content: ReadonlyArray<TiptapListItemNode>;
}

// 2. Define schemas using the forward-declared interfaces to avoid `any`.
const TiptapListItemNodeSchema: Schema.Schema<TiptapListItemNode> =
  Schema.suspend(() =>
    Schema.Struct({
      type: Schema.Literal("listItem"),
      content: Schema.Array(
        Schema.Union(
          TiptapParagraphNodeSchema,
          TiptapBulletListNodeSchema,
          TiptapHeadingNodeSchema,
        ),
      ),
    }),
  );

const TiptapBulletListNodeSchema: Schema.Schema<TiptapBulletListNode> =
  Schema.suspend(() =>
    Schema.Struct({
      type: Schema.Literal("bulletList"),
      content: Schema.Array(TiptapListItemNodeSchema),
    }),
  );

// First, define a schema that cleanly transforms between a plain string and a branded BlockId.
const BlockIdTransformSchema = Schema.transform(Schema.String, BlockIdSchema, {
  decode: (s) => s as BlockId,
  encode: (id) => id,
});

const InteractiveBlockSchema = Schema.Struct({
  type: Schema.Literal("interactiveBlock"),
  attrs: Schema.Struct({
    blockId: Schema.NullOr(BlockIdTransformSchema),
    blockType: Schema.Literal("task"),
    fields: Schema.Struct({
      is_complete: Schema.Boolean,
    }),
  }),
  content: Schema.optional(Schema.Array(TiptapTextNodeSchema)),
});
export type InteractiveBlock = Schema.Schema.Type<
  typeof InteractiveBlockSchema
>;

// 3. Create a comprehensive, strongly-typed union for any node type.
export type TiptapNode =
  | TiptapParagraphNode
  | TiptapBulletListNode
  | TiptapListItemNode
  | TiptapTextNode
  | TiptapHeadingNode
  | InteractiveBlock;

// Describes the top-level document structure from Tiptap
export const TiptapDocSchema = Schema.Struct({
  type: Schema.Literal("doc"),
  content: Schema.optional(
    Schema.Array(
      Schema.Union(
        TiptapParagraphNodeSchema,
        TiptapBulletListNodeSchema,
        TiptapHeadingNodeSchema,
        InteractiveBlockSchema,
      ),
    ),
  ),
});
export type TiptapDoc = Schema.Schema.Type<typeof TiptapDocSchema>;

const ContentSchema = Schema.transform(Schema.Unknown, TiptapDocSchema, {
  strict: true,
  decode: (u) => Schema.decodeUnknownSync(TiptapDocSchema)(u),
  // ✅ FIX: The decoded TiptapDoc is structurally identical to its JSON representation.
  // The branded types are compile-time only. By simply returning the value,
  // we avoid the recursive `encodeSync` call that confuses TypeScript's inference engine.
  encode: (t) => t,
});

export const NoteSchema = Schema.Struct({
  id: NoteIdSchema,
  user_id: UserIdSchema,
  title: Schema.String,
  content: ContentSchema,
  created_at: LenientDateSchema,
  updated_at: LenientDateSchema,
  version: Schema.Number,
});

export type AppNote = Schema.Schema.Type<typeof NoteSchema>;

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
