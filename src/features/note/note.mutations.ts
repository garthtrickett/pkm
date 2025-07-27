// FILE: src/features/note/note.mutations.ts
import { Effect, Schema, Layer } from "effect";
import { sql } from "kysely";
import { v4 as uuidv4 } from "uuid";
import { Db } from "../../db/DbTag";
import { Auth } from "../../lib/server/auth";
import {
  NoteIdSchema,
  UserId,
  UserIdSchema,
  type TiptapDoc,
  TiptapDocSchema,
  type TiptapNode,
  type TiptapParagraphNode,
  type TiptapTextNode,
  type TiptapBulletListNode,
  type TiptapListItemNode,
  type TiptapHeadingNode,
  BlockIdSchema,
  type InteractiveBlock,
} from "../../lib/shared/schemas";
import type { NewNote } from "../../types/generated/public/Note";
import { LinkService, LinkServiceLive } from "../../lib/server/LinkService";
import { TaskService, TaskServiceLive } from "../../lib/server/TaskService";
import type { NewBlock, BlockId } from "../../types/generated/public/Block";
import type { NoteId } from "../../types/generated/public/Note";

const TASK_REGEX = /^\s*(-\s*)?\[( |x)\]\s+(.*)/i;
const WIKI_LINK_REGEX = /\[\[([^\]]+)\]\]/g;
const TAG_REGEX = /#(\w+)/g;

type TraversableNode =
  | TiptapParagraphNode
  | TiptapBulletListNode
  | TiptapListItemNode
  | TiptapHeadingNode
  | InteractiveBlock;

const parseContentToBlocks = (
  noteId: NoteId,
  userId: UserId,
  contentJSON: TiptapDoc,
): NewBlock[] => {
  const parsedBlocks: NewBlock[] = [];

  const traverseNodes = (
    nodes: ReadonlyArray<TraversableNode> | undefined,
    parentId: BlockId | null,
    depth: number,
  ) => {
    if (!nodes) return;

    let order = 0;
    for (const node of nodes) {
      if (node.type === "interactiveBlock") {
        const blockId = node.attrs.blockId as BlockId;
        // ✅ MODIFIED: Correctly access the content from the node.
        const textContent =
          node.content
            ?.map((t) => t.text)
            .join("")
            .trim() ?? "";

        parsedBlocks.push({
          id: blockId,
          note_id: noteId,
          user_id: userId,
          parent_id: parentId,
          type: node.attrs.blockType,
          content: textContent,
          depth,
          order: order++,
          version: 1,
          fields: node.attrs.fields,
          tags: [],
          links: [],
          transclusions: [],
          file_path: "",
        });
      } else if (node.type === "bulletList" && node.content) {
        traverseNodes(node.content as TraversableNode[], parentId, depth);
      } else if (node.type === "listItem" && node.content) {
        const newBlockId = uuidv4() as BlockId;

        const paragraphNode = node.content.find(
          (n: TiptapNode): n is TiptapParagraphNode => n.type === "paragraph",
        );
        const textContent =
          paragraphNode?.content
            ?.map((t: TiptapTextNode) => t.text)
            .join("")
            .trim() || "";

        parsedBlocks.push({
          id: newBlockId,
          note_id: noteId,
          user_id: userId,
          parent_id: parentId,
          type: "text",
          content: textContent,
          depth,
          order: order++,
          version: 1,
          fields: {},
          tags: [],
          links: [],
          transclusions: [],
          file_path: "",
        });

        const nestedList = node.content.find(
          (n: TiptapNode): n is TiptapBulletListNode => n.type === "bulletList",
        );
        if (nestedList && nestedList.content) {
          traverseNodes(
            nestedList.content as TraversableNode[],
            newBlockId,
            depth + 1,
          );
        }
      } else if (node.type === "paragraph" || node.type === "heading") {
        const textContent =
          node.content
            ?.map((t: TiptapTextNode) => t.text)
            .join("")
            .trim() || "";

        if (textContent) {
          const newBlockId = uuidv4() as BlockId;
          let blockType: "text" | "task" = "text";
          let fields: Record<string, unknown> = {};

          const taskMatch = textContent.match(TASK_REGEX);
          if (taskMatch) {
            blockType = "task";
            fields = {
              is_complete: taskMatch[2]?.toLowerCase() === "x",
              content: taskMatch[3] ?? "",
            };
          }

          const tags = [...textContent.matchAll(TAG_REGEX)].flatMap((match) =>
            match[1] ? [match[1]] : [],
          );
          const links = [...textContent.matchAll(WIKI_LINK_REGEX)].flatMap(
            (match) => (match[1] ? [match[1]] : []),
          );

          parsedBlocks.push({
            id: newBlockId,
            note_id: noteId,
            user_id: userId,
            parent_id: parentId,
            type: blockType,
            content: textContent,
            depth,
            order: order++,
            version: 1,
            fields,
            tags,
            links,
            transclusions: [],
            file_path: "",
          });
        }
      }
    }
  };

  traverseNodes(contentJSON.content as TraversableNode[], null, 0);
  return parsedBlocks;
};

export const CreateNoteArgsSchema = Schema.Struct({
  id: NoteIdSchema,
  userID: UserIdSchema,
  title: Schema.String,
});
export type CreateNoteArgs = Schema.Schema.Type<typeof CreateNoteArgsSchema>;

export const UpdateNoteArgsSchema = Schema.Struct({
  id: NoteIdSchema,
  title: Schema.String,
  content: TiptapDocSchema,
});
export type UpdateNoteArgs = Schema.Schema.Type<typeof UpdateNoteArgsSchema>;

export const DeleteNoteArgsSchema = Schema.Struct({
  id: NoteIdSchema,
});
export type DeleteNoteArgs = Schema.Schema.Type<typeof DeleteNoteArgsSchema>;

export const UpdateTaskArgsSchema = Schema.Struct({
  blockId: BlockIdSchema,
  isComplete: Schema.Boolean,
});
export type UpdateTaskArgs = Schema.Schema.Type<typeof UpdateTaskArgsSchema>;

export const handleCreateNote = (
  args: CreateNoteArgs,
): Effect.Effect<void, Error, Db | Auth> =>
  Effect.gen(function* () {
    const db = yield* Db;
    const { user } = yield* Auth;
    const now = new Date();

    const newNote: NewNote = {
      id: args.id,
      title: args.title,
      content: { type: "doc", content: [] },
      user_id: user!.id,
      version: 1,
      created_at: now,
      updated_at: now,
    };

    yield* Effect.promise(() =>
      db.insertInto("note").values(newNote).execute(),
    );
  });

export const handleUpdateNote = (
  args: UpdateNoteArgs,
): Effect.Effect<void, Error, Db | Auth> =>
  Effect.gen(function* () {
    yield* Effect.logInfo(
      `[handleUpdateNote] Starting update for noteId: ${args.id}`,
    );
    const db = yield* Db;
    const { user } = yield* Auth;
    const linkService = yield* LinkService;
    const taskService = yield* TaskService;

    const updateAllEffect = Effect.promise(async () => {
      await db
        .updateTable("note")
        .set({
          title: args.title,
          content: args.content,
          version: sql`version + 1`,
          updated_at: new Date(),
        })
        .where("id", "=", args.id)
        .where("user_id", "=", user!.id)
        .execute();

      await db.deleteFrom("block").where("note_id", "=", args.id).execute();

      const newBlocks = parseContentToBlocks(args.id, user!.id, args.content);
      if (newBlocks.length > 0) {
        await db.insertInto("block").values(newBlocks).execute();
      }

      const syncServicesEffect = Effect.all([
        linkService.updateLinksForNote(args.id, user!.id),
        taskService.syncTasksForNote(args.id, user!.id),
      ]).pipe(Effect.provideService(Db, db));

      await Effect.runPromise(syncServicesEffect);
    }).pipe(
      Effect.catchAll((cause) =>
        Effect.logError("!!! DATABASE TRANSACTION FAILED !!!", cause).pipe(
          Effect.andThen(
            Effect.fail(
              new Error("Failed to update note and blocks", { cause }),
            ),
          ),
        ),
      ),
    );

    yield* updateAllEffect;

    yield* Effect.logInfo(
      `[handleUpdateNote] Finished update for noteId: ${args.id}`,
    );
  }).pipe(Effect.provide(Layer.merge(LinkServiceLive, TaskServiceLive)));

export const handleDeleteNote = (
  args: DeleteNoteArgs,
): Effect.Effect<void, Error, Db | Auth> =>
  Effect.gen(function* () {
    const db = yield* Db;
    const { user } = yield* Auth;

    yield* Effect.promise(() =>
      db
        .deleteFrom("note")
        .where("id", "=", args.id)
        .where("user_id", "=", user!.id)
        .execute(),
    );
  });

export const handleUpdateTask = (
  args: UpdateTaskArgs,
): Effect.Effect<void, Error, Db | Auth> =>
  Effect.gen(function* () {
    const db = yield* Db;
    const { user } = yield* Auth;

    yield* Effect.logInfo(
      `[handleUpdateTask] Updating task status for blockId: ${args.blockId}`,
    );

    yield* Effect.promise(() =>
      db
        .updateTable("task")
        .set({
          is_complete: args.isComplete,
          updated_at: new Date(),
        })
        .where("source_block_id", "=", args.blockId)
        .where("user_id", "=", user!.id)
        .execute(),
    );

    yield* Effect.promise(() =>
      db
        .updateTable("block")
        .set({
          fields: sql`fields || ${JSON.stringify({
            is_complete: args.isComplete,
          })}::jsonb`,
          updated_at: new Date(),
        })
        .where("id", "=", args.blockId)
        .where("user_id", "=", user!.id)
        .execute(),
    );
  });
