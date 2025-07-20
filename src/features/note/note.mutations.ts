// src/features/note/note.mutations.ts
import { Effect, Schema } from "effect";
import { sql } from "kysely";
import { Db } from "../../db/DbTag";
import { Auth } from "../../lib/server/auth";
import { NoteIdSchema, UserIdSchema } from "../../lib/shared/schemas";
import type { NewNote } from "../../types/generated/public/Note";

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
  content: Schema.String,
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
      content: "",
      user_id: user!.id,
      version: 1,
      created_at: now,
      updated_at: now,
    };

    yield* Effect.promise(() => db.insertInto("note").values(newNote).execute());
  });

export const handleUpdateNote = (
  args: UpdateNoteArgs,
): Effect.Effect<void, Error, Db | Auth> =>
  Effect.gen(function* () {
    const db = yield* Db;
    const { user } = yield* Auth;

    yield* Effect.promise(() =>
      db
        .updateTable("note")
        .set({
          title: args.title,
          content: args.content,
          version: sql`version + 1`,
          updated_at: new Date(),
        })
        .where("id", "=", args.id)
        .where("user_id", "=", user!.id)
        .execute(),
    );
  });

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
