// FILE: ./src/lib/client/replicache.ts
import {
  Replicache,
  type ReadonlyJSONValue,
  type WriteTransaction,
  type Puller,
  makeIDBName,
  type PullRequest as ReplicachePullRequest, // Renamed import
  type PullerResult, // Import PullerResult
} from "replicache";
import { Context, Layer, Effect, Schema } from "effect";
import type {
  PublicUser,
  NoteId,
  UserId,
  TiptapDoc,
  AppNote,
} from "../shared/schemas";
import { NoteSchema, TiptapDocSchema } from "../shared/schemas";
import { setupWebSocket } from "./replicache/websocket";
import {
  runClientPromise,
  runClientUnscoped,
  CustomHttpClientLive,
} from "./runtime";
import { PullResponseSchema } from "../shared/replicache-schemas";
import { clientLog } from "./clientLog";
import { RpcLogClientLive } from "./rpc";

class PullerHttpError extends Error {
  httpStatusCode: number;
  errorMessage: string;
  constructor(message: string, statusCode: number, responseText: string) {
    super(message);
    this.name = "PullerHttpError";
    this.httpStatusCode = statusCode;
    this.errorMessage = responseText;
  }
}

const mutators = {
  createNote: async (
    tx: WriteTransaction,
    args: { id: NoteId; userID: UserId; title: string },
  ): Promise<ReadonlyJSONValue> => {
    const now = new Date();
    const emptyContent: TiptapDoc = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [],
        },
      ],
    };

    const newNote = {
      id: args.id,
      user_id: args.userID,
      title: args.title,
      content: emptyContent,
      version: 1,
      created_at: now,
      updated_at: now,
    };

    const jsonCompatibleNote = {
      ...newNote,
      content: Schema.encodeSync(TiptapDocSchema)(newNote.content),
      created_at: newNote.created_at.toISOString(),
      updated_at: newNote.updated_at.toISOString(),
    };

    await tx.set(
      `note/${newNote.id}`,
      jsonCompatibleNote as unknown as ReadonlyJSONValue,
    );
    return jsonCompatibleNote as unknown as ReadonlyJSONValue;
  },
  updateNote: async (
    tx: WriteTransaction,
    args: { id: NoteId; title: string; content: TiptapDoc },
  ) => {
    // [DEBUG] Log arguments received by the mutator

    const noteKey = `note/${args.id}`;
    const noteJSON = await tx.get(noteKey);
    if (!noteJSON) {
      return;
    }

    const note = Schema.decodeUnknownSync(NoteSchema)(noteJSON);

    const updatedNote: AppNote = {
      ...note,
      title: args.title,
      content: args.content,
      version: note.version + 1,
      updated_at: new Date(),
    };

    const jsonCompatibleUpdate = {
      ...updatedNote,
      content: Schema.encodeSync(TiptapDocSchema)(updatedNote.content),
      created_at: updatedNote.created_at.toISOString(),
      updated_at: updatedNote.updated_at.toISOString(),
    };

    await tx.set(noteKey, jsonCompatibleUpdate as unknown as ReadonlyJSONValue);
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

const debugPuller: Puller = (
  request: ReplicachePullRequest,
): Promise<PullerResult> => {
  const pullEffect = Effect.tryPromise({
    try: async () => {
      if (!("clientGroupID" in request)) {
        throw new Error(
          `PullRequestV0 is not supported. Request: ${JSON.stringify(request)}`,
        );
      }

      const body = {
        clientGroupID: request.clientGroupID,
        cookie: request.cookie,
      };
      const response = await fetch("/api/replicache/pull", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const responseText = await response.text();

      if (!response.ok) {
        throw new PullerHttpError(
          `HTTP Error: ${response.status}`,
          response.status,
          responseText,
        );
      }

      const pullResponse = Schema.decodeUnknownSync(PullResponseSchema)(
        JSON.parse(responseText),
      );
      // This explicit cast tells TypeScript that we are correctly returning
      // a member of the PullerResult union type, resolving the ambiguity.
      return {
        response: pullResponse,
        httpRequestInfo: {
          httpStatusCode: response.status,
          errorMessage: "",
        },
      } as PullerResult;
    },
    catch: (error: unknown) => {
      let httpStatusCode = 0;
      let errorMessage = "Unknown puller error";

      if (error instanceof PullerHttpError) {
        httpStatusCode = error.httpStatusCode;
        errorMessage = error.errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        response: undefined,
        httpRequestInfo: { httpStatusCode, errorMessage },
      } as PullerResult; // Also cast the error case for consistency.
    },
  });

  return runClientPromise(pullEffect);
};

export const ReplicacheLive = (
  user: PublicUser,
): Layer.Layer<ReplicacheService, never, never> => {
  const RpcLogClientSelfContained = Layer.provide(
    RpcLogClientLive,
    CustomHttpClientLive,
  );
  const replicacheServiceEffect = Effect.acquireRelease(
    Effect.gen(function* () {
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

      yield* Effect.all([deleteDb(userDbName), deleteDb(metaDbName)], {
        concurrency: "unbounded",
        discard: true,
      }).pipe(Effect.catchAll(() => Effect.void));
      const client = new Replicache({
        licenseKey: "l2c75a896d85a4914a51e54a32338b556",
        name: user.id,
        pushURL: "/api/replicache/push",
        puller: debugPuller,
        mutators,
      });

      yield* setupWebSocket(client).pipe(Effect.forkDaemon);

      return { client };
    }),
    ({ client }) =>
      Effect.gen(function* () {
        yield* clientLog(
          "info",
          "[ReplicacheLive] Releasing scope. Closing Replicache client.",
        );
        yield* Effect.promise(() => client.close());
      }).pipe(Effect.orDie),
  ).pipe(Effect.map(({ client }) => ({ client })));

  return Layer.scoped(ReplicacheService, replicacheServiceEffect).pipe(
    Layer.provide(RpcLogClientSelfContained),
  );
};
