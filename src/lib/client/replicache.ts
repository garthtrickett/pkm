// FILE: ./src/lib/client/replicache.ts
import {
  Replicache,
  type ReadonlyJSONValue,
  type WriteTransaction,
  type Puller,
  type HTTPRequestInfo,
  type PullerResultV1,
  makeIDBName,
} from "replicache";
import { Context, Layer, Effect, Schema } from "effect";
import type { PublicUser, Note, NoteId, UserId } from "../shared/schemas";
import { NoteSchema } from "../shared/schemas";
import { setupWebSocket } from "./replicache/websocket";
import { runClientUnscoped, CustomHttpClientLive } from "./runtime";
import { PullRequestV1 } from "replicache";
import { PullResponseSchema } from "../shared/replicache-schemas";
import { clientLog } from "./clientLog";
import { RpcLogClientLive } from "./rpc";

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

export interface IReplicacheService {
  readonly client: Replicache<ReplicacheMutators>;
}
export class ReplicacheService extends Context.Tag("ReplicacheService")<
  ReplicacheService,
  IReplicacheService
>() {}

const debugPuller: Puller = (async (
  request: PullRequestV1,
): Promise<PullerResultV1> => {
  try {
    const body = {
      clientGroupID: request.clientGroupID,
      cookie: request.cookie,
      schemaVersion: request.schemaVersion,
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
      return { response: undefined, httpRequestInfo };
    }
    const pullResponseV1 = Schema.decodeUnknownSync(PullResponseSchema)(
      JSON.parse(responseText),
    );
    return { response: pullResponseV1, httpRequestInfo };
  } catch (e) {
    runClientUnscoped(
      clientLog("error", "Replicache puller caught an unexpected exception.", {
        error: e,
      }),
    );
    const errorMsg = e instanceof Error ? e.message : "Unknown puller error";
    const httpRequestInfo: HTTPRequestInfo = {
      httpStatusCode: 0,
      errorMessage: errorMsg,
    };
    return { response: undefined, httpRequestInfo };
  }
}) as Puller;

export const ReplicacheLive = (
  user: PublicUser,
): Layer.Layer<ReplicacheService, never, never> => {
  const RpcLogClientSelfContained = Layer.provide(
    RpcLogClientLive,
    CustomHttpClientLive,
  );
  const replicacheServiceEffect = Effect.acquireRelease(
    Effect.gen(function* () {
      // --- NEW LOGIC: Proactively delete old databases before initializing ---
      const userDbName = makeIDBName(user.id);
      const metaDbName = "replicache-dbs-v0";

      const deleteDb = (dbName: string) =>
        Effect.async<void, Error>((resume) => {
          const req = window.indexedDB.deleteDatabase(dbName);
          req.onblocked = () => {
            runClientUnscoped(
              clientLog("warn", `Deletion of '${dbName}' is blocked.`),
            );
          };
          req.onsuccess = () => resume(Effect.succeed(undefined));
          req.onerror = () =>
            resume(
              Effect.fail(new Error(`Failed to delete IndexedDB: ${dbName}`)),
            );
        });

      yield* clientLog(
        "info",
        `[ReplicacheLive] Ensuring clean slate by deleting databases: '${userDbName}' and '${metaDbName}'.`,
      );

      // We run the deletions and ignore any errors (e.g., if they don't exist on first login)
      yield* Effect.all([deleteDb(userDbName), deleteDb(metaDbName)], {
        concurrency: "unbounded",
        discard: true,
      }).pipe(Effect.catchAll(() => Effect.void));
      // --- END OF NEW LOGIC ---

      // Now, we can safely create the new Replicache instance
      const client = new Replicache({
        licenseKey: "l2c75a896d85a4914a51e54a32338b556",
        name: user.id, // Use user.id which is stable
        pushURL: "/api/replicache/push",
        puller: debugPuller,
        mutators,
      });

      const ws = yield* setupWebSocket(client).pipe(Effect.orDie);
      return { client, ws };
    }),
    // --- SIMPLIFIED RELEASE: Deletion logic has been moved to the acquire step ---
    ({ client, ws }) =>
      Effect.gen(function* () {
        yield* clientLog(
          "info",
          "[ReplicacheLive] Releasing scope. Closing WebSocket and Replicache client.",
        );
        ws.close();
        yield* Effect.promise(() => client.close());
      }).pipe(Effect.orDie),
  ).pipe(Effect.map(({ client }) => ({ client })));

  return Layer.scoped(ReplicacheService, replicacheServiceEffect).pipe(
    Layer.provide(RpcLogClientSelfContained),
  );
};
