// FILE: src/lib/server/TaskService.ts
import { Context, Data, Effect, Layer } from "effect";
import { Db } from "../../db/DbTag";
import type { UserId } from "../../types/generated/public/User";
import type { NoteId } from "../shared/schemas";
import type { NewTask } from "../../types/generated/public/Task";

const TASK_REGEX = /^\s*-\s*\[( |x)\]\s+(.*)/i;

class TaskServiceError extends Data.TaggedError("TaskServiceError")<{
  readonly cause: unknown;
}> {}

export interface ITaskService {
  readonly syncTasksForNote: (
    noteId: NoteId,
    userId: UserId,
  ) => Effect.Effect<void, TaskServiceError, Db>;
}

export class TaskService extends Context.Tag("TaskService")<
  TaskService,
  ITaskService
>() {}

export const TaskServiceLive = Layer.succeed(
  TaskService,
  TaskService.of({
    syncTasksForNote: (noteId, userId) =>
      Effect.gen(function* () {
        const db = yield* Db; // This 'db' is already a transaction
        yield* Effect.logDebug(
          `[TaskService] Starting sync for noteId: ${noteId}`,
        );

        const blocks = yield* Effect.tryPromise({
          try: () =>
            db
              .selectFrom("block")
              .select(["id", "content"])
              .where("note_id", "=", noteId)
              .where("user_id", "=", userId)
              .execute(),
          catch: (cause) => new TaskServiceError({ cause }),
        });
        yield* Effect.logDebug(
          `[TaskService] Found ${blocks.length} blocks for note.`,
        );

        const blockIds = blocks.map((b) => b.id);

        // --- START OF FIX: Remove nested transaction ---

        // Delete all existing tasks sourced from this note's blocks
        yield* Effect.tryPromise({
          try: () =>
            db
              .deleteFrom("task")
              .where("source_block_id", "in", blockIds)
              .execute(),
          catch: (cause) => new TaskServiceError({ cause }),
        });
        yield* Effect.logDebug(`[TaskService] Deleted old tasks.`);

        if (blocks.length === 0) {
          return;
        }

        const newTasks: NewTask[] = [];
        for (const block of blocks) {
          const match = block.content.match(TASK_REGEX);
          if (match) {
            const is_complete = match[1]?.toLowerCase() === "x";
            const content = match[2] ?? "";

            newTasks.push({
              user_id: userId,
              source_block_id: block.id,
              content,
              is_complete,
            });
          }
        }

        if (newTasks.length > 0) {
          // Then, insert the new tasks we just parsed.
          yield* Effect.tryPromise({
            try: () => db.insertInto("task").values(newTasks).execute(),
            catch: (cause) => new TaskServiceError({ cause }),
          });
          yield* Effect.logDebug(
            `[TaskService] Inserted ${newTasks.length} new tasks.`,
          );
        }

        // --- END OF FIX ---

        yield* Effect.logInfo(
          `[TaskService] Finished task sync for note ${noteId}.`,
        );
      }),
  }),
);
