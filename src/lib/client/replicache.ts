// FILE: ./src/lib/client/replicache.ts
import {
  Replicache,
  type ReadonlyJSONValue,
  type WriteTransaction,
  type Puller,
  type HTTPRequestInfo,
  // ✅ Import the specific V1 result type
  type PullerResultV1,
} from "replicache";
import { Context, Layer, Effect, Schema } from "effect";
import type { PublicUser, Note, NoteId, UserId } from "../shared/schemas";
import { NoteSchema } from "../shared/schemas";
import { setupWebSocket } from "./replicache/websocket";
import { runClientUnscoped } from "./runtime";
import { PullRequestV1 } from "replicache";
import { PullResponseSchema } from "../shared/replicache-schemas";

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

// ✅ FIX: Define the puller with a specific V1 return type, then cast it.
const debugPuller: Puller = (async (
  request: PullRequestV1,
): Promise<PullerResultV1> => {
  try {
    const body = {
      clientGroupID: request.clientGroupID,
      cookie: request.cookie,
      schemaVersion: request.schemaVersion,
      // The `request` object has `clientID` at runtime, but not in its type.
      // We add it to the body object that gets sent to the server.
      clientID: (request as unknown as { clientID: string }).clientID,
    };

    const response = await fetch("/api/replicache/pull", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();

    const httpRequestInfo: HTTPRequestInfo = {
      httpStatusCode: response.status,
      errorMessage: response.ok ? "" : responseText,
    };

    if (!response.ok) {
      // On failure, return an undefined response as required by the type.
      return { response: undefined, httpRequestInfo };
    }

    const pullResponseV1 = Schema.decodeUnknownSync(PullResponseSchema)(
      JSON.parse(responseText),
    );

    // This object now perfectly matches the PullResponseV1 shape.
    return { response: pullResponseV1, httpRequestInfo };
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Unknown puller error";
    const httpRequestInfo: HTTPRequestInfo = {
      httpStatusCode: 0,
      errorMessage: errorMsg,
    };
    // On exception, also return with an undefined response.
    return { response: undefined, httpRequestInfo };
  }
}) as Puller; // The type assertion happens here.

export const ReplicacheLive = (
  user: PublicUser,
): Layer.Layer<ReplicacheService> =>
  Layer.scoped(
    ReplicacheService,
    Effect.acquireRelease(
      Effect.sync(() => {
        const client = new Replicache({
          licenseKey: "l2c75a896d85a4914a51e54a32338b556",
          name: user.id,
          pushURL: "/api/replicache/push",
          puller: debugPuller,
          mutators,
        });

        runClientUnscoped(Effect.forkDaemon(setupWebSocket(client)));

        return { client };
      }),
      (service) => Effect.sync(() => service.client.close()),
    ),
  );
