// FILE: ./src/lib/client/replicache.ts
import {
  Replicache,
  type ReadonlyJSONValue,
  type WriteTransaction,
  type Puller,
  type PullRequest,
  type HTTPRequestInfo,
} from "replicache";
import { Context, Layer, Effect, Schema } from "effect";
import type { PublicUser, Note, NoteId, UserId } from "../shared/schemas";
import { NoteSchema } from "../shared/schemas";
import { setupWebSocket } from "./replicache/websocket";
import { runClientUnscoped } from "./runtime";
import { clientLog } from "./clientLog";

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

// ✅ A more robust and diagnostic puller function with extensive logging
const debugPuller: Puller = async (request: PullRequest) => {
  try {
    const response = await fetch("/api/replicache/pull", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    // Step 1: Log the raw text response from the server.
    const responseText = await response.text();
    console.log("[PULLER] Raw text from server:", responseText);

    const httpRequestInfo: HTTPRequestInfo = {
      httpStatusCode: response.status,
      errorMessage: response.statusText,
    };

    if (!response.ok) {
      console.error(
        `[PULLER] Fetch failed with status ${response.status}`,
        responseText,
      );
      return {
        error: `Fetch failed with status ${response.status}`,
        httpRequestInfo,
      };
    }

    // Step 2: Parse the JSON and log the resulting object.
    const pullResponse = JSON.parse(responseText);
    console.log("[PULLER] Parsed pullResponse object:", pullResponse);

    // --- ADD THIS DETAILED LOGGING ---
    // Step 3: Explicitly check the types of critical fields after parsing.
    if (pullResponse) {
      console.log(
        `[PULLER] ✅ typeof pullResponse.cookie: ${typeof pullResponse.cookie}`,
      );
      console.log(
        `[PULLER] ✅ typeof pullResponse.lastMutationID: ${typeof pullResponse.lastMutationID}`,
      );
    } else {
      console.error(
        "[PULLER] ❌ pullResponse is null or undefined after parsing!",
      );
    }
    // --- END DETAILED LOGGING ---

    // This is the object we will return
    const result = { response: pullResponse, httpRequestInfo };

    // Step 4: Log the final object being sent to Replicache for validation.
    console.log("[PULLER] ✅ Returning this object to Replicache:", result);

    return result;
  } catch (e) {
    console.error("Error in custom puller:", e);
    const errorMsg = e instanceof Error ? e.message : "Unknown puller error";
    const httpRequestInfo: HTTPRequestInfo = {
      httpStatusCode: 0,
      errorMessage: errorMsg,
    };
    return { error: errorMsg, httpRequestInfo };
  }
};

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
