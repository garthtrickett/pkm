// FILE: ./src/lib/client/replicache.ts
import {
  Replicache,
  type ReadonlyJSONValue,
  type WriteTransaction,
} from "replicache";
import { Context, Layer, Effect, Schema } from "effect";
import type { PublicUser, Note, NoteId, UserId } from "../shared/schemas";
import { NoteSchema } from "../shared/schemas";
import { setupWebSocket } from "./replicache/websocket";
import { runClientUnscoped } from "./runtime";

// --- Mutators (unchanged) ---
const mutators = {
  createNote: async (
    tx: WriteTransaction,
    args: { id: NoteId; userID: UserId; title: string },
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
  updateNote: async (
    tx: WriteTransaction,
    args: { id: NoteId; title: string; content: string },
  ) => {
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
  deleteNote: async (tx: WriteTransaction, { id }: { id: NoteId }) => {
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

// This function returns a SCOPED LAYER.
// A scoped layer automatically handles setup (acquire) and teardown (release).
export const ReplicacheLive = (
  user: PublicUser,
): Layer.Layer<ReplicacheService> =>
  Layer.scoped(
    ReplicacheService,
    Effect.acquireRelease(
      // Acquire: This effect runs to create the service.
      Effect.sync(() => {
        const client = new Replicache({
          licenseKey: "l2c75a896d85a4914a51e54a32338b556",
          name: user.id,
          pushURL: "/api/replicache/push",
          pullURL: "/api/replicache/pull",
          mutators,
        });

        // Fork the WebSocket setup into the background.
        runClientUnscoped(Effect.forkDaemon(setupWebSocket(client)));

        return { client };
      }),
      // Release: This effect runs when the scope is closed (e.g., on logout).
      (service) => Effect.sync(() => service.client.close()),
    ),
  );
