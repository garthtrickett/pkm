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
} from "../../lib/shared/schemas";
import type { NewNote } from "../../types/generated/public/Note";
import { LinkService, LinkServiceLive } from "../../lib/server/LinkService";
import { TaskService, TaskServiceLive } from "../../lib/server/TaskService";
import type { NewBlock, BlockId } from "../../types/generated/public/Block";
import type { NoteId } from "../../types/generated/public/Note";

const parseContentToBlocks = (
  noteId: NoteId,
  userId: UserId,
  contentJSON: TiptapDoc,
): NewBlock[] => {
  const tiptapBlocks = contentJSON.content || [];
  const parsedBlocks: NewBlock[] = [];
  const parentStack: (BlockId | null)[] = [null]; // stack to track parent IDs by depth
  const orderCounters: Map<BlockId | "root", number> = new Map();

  for (const blockNode of tiptapBlocks) {
    if (blockNode.type !== "blockNode" || !blockNode.content) continue;

    const newBlockId = uuidv4() as BlockId;
    const depth = blockNode.attrs?.depth ?? 0;
    const textContent =
      blockNode.content
        ?.map((p) => p.content?.map((t) => t.text).join("") || "")
        .join("\n") || "";

    // Determine parent and order
    const parentId = depth > 0 ? parentStack[depth - 1] : null;
    const parentKey = parentId || "root";
    const order = orderCounters.get(parentKey) || 0;
    orderCounters.set(parentKey, order + 1);

    // Update parent stack
    parentStack[depth] = newBlockId;
    parentStack.length = depth + 1; // Prune deeper levels

    parsedBlocks.push({
      id: newBlockId,
      note_id: noteId,
      user_id: userId,
      parent_id: parentId,
      type: "text", // Default type for now
      content: textContent,
      depth,
      order,
      version: 1,
      fields: {},
      tags: [],
      links: [],
      transclusions: [],
      file_path: "",
    });
  }

  return parsedBlocks;
};

// --- Mutation Argument Schemas ---
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

// --- Mutation Handlers ---

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
      content: { type: "doc", content: [] }, // Start with empty Tiptap content
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
    const db = yield* Db; // This 'db' object IS the transaction from push.ts
    const { user } = yield* Auth;
    const linkService = yield* LinkService;
    const taskService = yield* TaskService;

    // All async logic now happens inside this single promise,
    // using the 'db' object which is already a transaction.
    const updateAllEffect = Effect.promise(async () => {
      // 1. Update the main note content
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

      // 2. Delete old blocks associated with the note
      await db.deleteFrom("block").where("note_id", "=", args.id).execute();

      // 3. Parse new content and insert new blocks
      const newBlocks = parseContentToBlocks(args.id, user!.id, args.content);
      if (newBlocks.length > 0) {
        await db.insertInto("block").values(newBlocks).execute();
      }

      // --- START OF FIX: Provide the Db (transaction) to the services ---
      // 4. Sync links and tasks using the SAME transaction.
      // We create an effect pipeline that provides the `db` service to each sub-task.
      const syncServicesEffect = Effect.all([
        linkService.updateLinksForNote(args.id, user!.id),
        taskService.syncTasksForNote(args.id, user!.id),
      ]).pipe(Effect.provideService(Db, db)); // <-- This provides the dependency

      // Run the pipeline.
      await Effect.runPromise(syncServicesEffect);
      // --- END OF FIX ---
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
