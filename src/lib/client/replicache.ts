// FILE: ./src/lib/client/replicache.ts
import { runClientUnscoped } from "./runtime";
import {
  Replicache,
  type ReadonlyJSONValue,
  type WriteTransaction,
  type Puller,
  type PullerResult,
  type Pusher,
  type PusherResult,
  type PushRequest,
} from "replicache";
import { Context, Layer, Effect, Schema } from "effect";
import { HttpClient, HttpBody } from "@effect/platform";
import type {
  PublicUser,
  NoteId,
  UserId,
  TiptapDoc,
  AppNote,
  BlockId,
} from "../shared/schemas";
import { NoteSchema, BlockSchema, TiptapDocSchema } from "../shared/schemas";
import { setupWebSocket } from "./replicache/websocket";
import { runClientPromise, type FullClientContext } from "./runtime";
import { PullResponseSchema } from "../shared/replicache-schemas";
import { clientLog } from "./clientLog";
import { RpcLogClient } from "./rpc";

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
    const noteKey = `note/${args.id}`;
    const noteJSON = await tx.get(noteKey);
    if (!noteJSON) {
      return;
    }

    try {
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

      const interactiveBlocks = (args.content.content ?? []).filter(
        (node) => node.type === "interactiveBlock",
      );

      const blockIdsInContent = interactiveBlocks
        .map((b) => b.attrs?.blockId as BlockId)
        .filter(Boolean);

      if (blockIdsInContent.length > 0) {
        const existingBlocks = new Set<BlockId>();
        const existenceChecks = blockIdsInContent.map((id) =>
          tx.get(`block/${id}`),
        );
        const results = await Promise.all(existenceChecks);

        results.forEach((value, index) => {
          if (value) {
            existingBlocks.add(blockIdsInContent[index]!);
          }
        });
        const blocksToCreate = interactiveBlocks.filter(
          (b) => b.attrs?.blockId && !existingBlocks.has(b.attrs.blockId),
        );

        if (blocksToCreate.length > 0) {
          const now = new Date().toISOString();
          for (const iBlock of blocksToCreate) {
            const blockId = iBlock.attrs.blockId as BlockId;
            const newBlockValue = {
              _tag: "block",
              id: blockId,
              user_id: note.user_id,
              note_id: note.id,
              type: iBlock.attrs.blockType,
              content: "",
              fields: iBlock.attrs.fields,
              tags: [],
              links: [],
              file_path: "",
              parent_id: null,
              depth: 0,
              order: 0,
              transclusions: [],
              version: 1,
              created_at: now,
              updated_at: now,
            };
            await tx.set(
              `block/${blockId}`,
              newBlockValue as ReadonlyJSONValue,
            );
          }
        }
      }

      await tx.set(
        noteKey,
        jsonCompatibleUpdate as unknown as ReadonlyJSONValue,
      );
    } catch (error) {
      throw error;
    }
  },

  deleteNote: async (tx: WriteTransaction, { id }: { id: NoteId }) => {
    await tx.del(`note/${id}`);
  },
  updateTask: async (
    tx: WriteTransaction,
    args: { blockId: BlockId; isComplete: boolean },
  ) => {
    if (!args.blockId) {
      return;
    }

    const blockKey = `block/${args.blockId}`;

    const blockJSON = await tx.get(blockKey);

    if (!blockJSON) {
      return;
    }

    const block = Schema.decodeUnknownSync(BlockSchema)(blockJSON);

    const updatedBlock = {
      ...block,
      fields: {
        ...(typeof block.fields === "object" && block.fields !== null
          ? block.fields
          : {}),
        is_complete: args.isComplete,
      },
      updated_at: new Date(),
    };

    const jsonCompatibleUpdate = {
      ...updatedBlock,
      created_at: updatedBlock.created_at.toISOString(),
      updated_at: updatedBlock.updated_at.toISOString(),
    };

    await tx.set(
      blockKey,
      jsonCompatibleUpdate as unknown as ReadonlyJSONValue,
    );
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

const puller: Puller = (request) => {
  const pullEffect = Effect.gen(function* () {
    if (!("clientGroupID" in request)) {
      throw new Error(
        `PullRequestV0 is not supported. Request: ${JSON.stringify(request)}`,
      );
    }
    const client = yield* HttpClient.HttpClient;
    const requestBody = yield* HttpBody.json({
      clientGroupID: request.clientGroupID,
      cookie: request.cookie,
    });
    const pullResponse = yield* client.post("/api/replicache/pull", {
      body: requestBody,
    });
    if (pullResponse.status < 200 || pullResponse.status >= 300) {
      const responseText = yield* pullResponse.text;
      throw new PullerHttpError(
        `HTTP Error: ${pullResponse.status}`,
        pullResponse.status,
        responseText,
      );
    }
    const json = yield* pullResponse.json;
    const decoded = yield* Schema.decodeUnknown(PullResponseSchema)(json);
    return {
      response: decoded,
      httpRequestInfo: {
        httpStatusCode: pullResponse.status,
        errorMessage: "",
      },
    } as PullerResult;
  }).pipe(
    Effect.catchAll((error) => {
      let httpStatusCode = 0;
      let errorMessage = "Unknown puller error";
      if (error instanceof PullerHttpError) {
        httpStatusCode = error.httpStatusCode;
        errorMessage = error.errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      return Effect.succeed({
        response: undefined,
        httpRequestInfo: { httpStatusCode, errorMessage },
      } as PullerResult);
    }),
  );
  return runClientPromise(
    pullEffect as Effect.Effect<PullerResult, never, FullClientContext>,
  );
};

const pusher: Pusher = (requestBody: PushRequest) => {
  const pushEffect = Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;
    const body = yield* HttpBody.json(requestBody);

    const response = yield* client.post("/api/replicache/push", {
      body,
    });

    if (response.status < 200 || response.status >= 300) {
      const responseText = yield* response.text;
      return {
        httpRequestInfo: {
          httpStatusCode: response.status,
          errorMessage: responseText,
        },
      };
    }

    return {
      httpRequestInfo: {
        httpStatusCode: response.status,
        errorMessage: "",
      },
    };
  }).pipe(
    Effect.catchAll((error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown push error";
      return Effect.succeed({
        httpRequestInfo: {
          httpStatusCode: 0,
          errorMessage,
        },
      });
    }),
  );

  return runClientPromise(
    pushEffect as Effect.Effect<PusherResult, never, FullClientContext>,
  );
};

export const ReplicacheLive = (
  user: PublicUser,
): Layer.Layer<ReplicacheService, never, RpcLogClient> => {
  const replicacheServiceEffect = Effect.acquireRelease(
    Effect.async<IReplicacheService, Error>((resume) => {
      const client = new Replicache({
        licenseKey: "l2c75a896d85a4914a51e54a32338b556",
        name: user.id,
        puller,
        pusher,
        mutators,
      });

      client.onOnlineChange = (online: boolean) => {
        if (online) {
          client.onOnlineChange = null;
          runClientUnscoped(setupWebSocket(client).pipe(Effect.forkDaemon));
          resume(Effect.succeed({ client }));
        }
      };
    }),
    ({ client }) =>
      Effect.gen(function* () {
        yield* clientLog(
          "info",
          "[ReplicacheLive] Releasing scope. Closing Replicache client.",
        );
        yield* Effect.promise(() => client.close());
      }).pipe(Effect.orDie),
  );

  // ✅ FIX: Pipe the effect through `orDie` to handle the `Error` channel,
  // making the resulting Layer's error channel `never`.
  const scopedEffectWithNoError = replicacheServiceEffect.pipe(Effect.orDie);

  return Layer.scoped(ReplicacheService, scopedEffectWithNoError);
};
