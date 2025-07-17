// src/lib/client/replicache.ts
import {
  Replicache,
  type ReadonlyJSONValue,
  type WriteTransaction,
} from "replicache";
import { Context, Layer } from "effect";
import type { PublicUser, Note, NoteId, UserId } from "../shared/schemas";
import { Schema } from "effect";
import { NoteSchema } from "../shared/schemas";

// --- Type definitions for our mutators ---
interface CreateNoteArgs {
  id: NoteId;
  userID: UserId;
  title: string;
}

// ✅ FIX: Update the interface to include an optional title
interface UpdateNoteArgs {
  id: NoteId;
  title: string;
  content: string;
}

interface DeleteNoteArgs {
  id: NoteId;
}

const mutators = {
  createNote: async (
    tx: WriteTransaction,
    args: CreateNoteArgs,
  ): Promise<ReadonlyJSONValue> => {
    const now = new Date();
    const newNote: Note = {
      id: args.id,
      user_id: args.userID,
      title: args.title,
      content: "",
      version: 1,
      created_at: now,
      updated_at: now,
    };
    const jsonCompatibleNote = {
      ...newNote,
      created_at: newNote.created_at.toISOString(),
      updated_at: newNote.updated_at.toISOString(),
    };
    await tx.set(`note/${newNote.id}`, jsonCompatibleNote);
    return jsonCompatibleNote;
  },

  // ✅ FIX: Update the mutator to handle title and content updates
  updateNote: async (tx: WriteTransaction, args: UpdateNoteArgs) => {
    const noteKey = `note/${args.id}`;
    const noteJSON = await tx.get(noteKey);

    if (noteJSON === undefined) {
      console.warn(`Note with id ${args.id} not found for update.`);
      return;
    }

    const note = Schema.decodeUnknownSync(NoteSchema)(noteJSON);

    const updatedNote: Note = {
      ...note,
      title: args.title,
      content: args.content,
      version: note.version + 1,
      updated_at: new Date(),
    };

    const jsonCompatibleUpdate = {
      ...updatedNote,
      created_at: updatedNote.created_at.toISOString(),
      updated_at: updatedNote.updated_at.toISOString(),
    };

    await tx.set(noteKey, jsonCompatibleUpdate);
  },

  deleteNote: async (tx: WriteTransaction, { id }: DeleteNoteArgs) => {
    await tx.del(`note/${id}`);
  },
};

export type ReplicacheMutators = typeof mutators;

// --- Effect Service Definition ---
export interface IReplicacheService {
  readonly client: Replicache<ReplicacheMutators>;
}

export class ReplicacheService extends Context.Tag("ReplicacheService")<
  ReplicacheService,
  IReplicacheService
>() {}

export const ReplicacheLive = (user: PublicUser) =>
  Layer.sync(ReplicacheService, () => {
    const client = new Replicache({
      licenseKey: "l2c75a896d85a4914a51e54a32338b556",
      name: user.id,
      pushURL: "/api/rpc/replicachePush",
      pullURL: "/api/rpc/replicachePull",
      mutators,
    });
    return { client };
  });
