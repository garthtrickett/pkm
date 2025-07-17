// src/features/replicache/pull.ts
import { Effect, Schema, Option } from "effect";
import {
  type PullRequest,
  type PullResponse,
  PullResponseSchema,
} from "../../lib/shared/replicache-schemas";
import { Db } from "../../db/DbTag";
import { Auth, AuthError } from "../../lib/server/auth";
import type { PublicUser } from "../../lib/shared/schemas";
import { NoteSchema, BlockSchema } from "../../lib/shared/schemas";
import type {
  ReplicacheClient,
  ReplicacheClientId,
} from "../../types/generated/public/ReplicacheClient";
import type {
  ReplicacheClientGroupId,
  ReplicacheClientGroup,
} from "../../types/generated/public/ReplicacheClientGroup";
import type { ClientViewRecordId } from "../../types/generated/public/ClientViewRecord";
import type { NoteId } from "../../lib/shared/schemas";
import type { BlockId } from "../../lib/shared/schemas";
// ✅ FIX: Import Kysely's Transaction type and our Database interface.
import { type Transaction } from "kysely";
import type { Database } from "../../types";

type ClientState = {
  client: ReplicacheClient;
  clientGroup: ReplicacheClientGroup;
};

// Helper to get or create client group and client state within a transaction
const getOrCreateClientState = (
  // ✅ FIX: Use the specific Transaction type instead of `any` to preserve type information.
  trx: Transaction<Database>,
  clientGroupID: string,
  user: PublicUser,
): Effect.Effect<ClientState> =>
  Effect.gen(function* (_) {
    const groupID = user.id as unknown as ReplicacheClientGroupId;

    const clientGroup = yield* _(
      Effect.promise(() =>
        trx
          .selectFrom("replicache_client_group")
          .selectAll()
          .where("id", "=", groupID)
          .executeTakeFirst(),
      ),
      Effect.map(Option.fromNullable),
      Effect.flatMap(
        Option.match({
          onNone: () =>
            Effect.promise(() =>
              trx
                .insertInto("replicache_client_group")
                .values({
                  id: groupID,
                  user_id: user.id,
                  cvr_version: 0,
                })
                .returningAll()
                .executeTakeFirstOrThrow(),
            ),
          onSome: Effect.succeed,
        }),
      ),
    );

    const clientID = `${clientGroupID}-${user.id}`;
    const client = yield* _(
      Effect.promise(() =>
        trx
          .selectFrom("replicache_client")
          .selectAll()
          .where("id", "=", clientID as ReplicacheClientId)
          .executeTakeFirst(),
      ),
      Effect.map(Option.fromNullable),
      Effect.flatMap(
        Option.match({
          onNone: () =>
            Effect.promise(() =>
              trx
                .insertInto("replicache_client")
                .values({
                  id: clientID as ReplicacheClientId,
                  client_group_id: clientGroup.id, // This now has the correct type
                  last_mutation_id: 0,
                })
                .returningAll()
                .executeTakeFirstOrThrow(),
            ),
          onSome: Effect.succeed,
        }),
      ),
    );

    return { client, clientGroup };
  });

// The rest of the file remains the same as the previous correct version.
export const handlePull = (
  req: PullRequest,
): Effect.Effect<PullResponse, AuthError, Db | Auth> =>
  Effect.gen(function* (_) {
    const { clientGroupID } = req;
    const fromVersion = req.cookie ?? 0;

    yield* _(
      Effect.logInfo({ clientGroupID, fromVersion }, "Processing pull request"),
    );

    const db = yield* _(Db);
    const { user } = yield* _(Auth);

    const pullResult = yield* _(
      Effect.tryPromise({
        try: () =>
          db.transaction().execute(async (trx) => {
            const { client, clientGroup } = await Effect.runPromise(
              getOrCreateClientState(trx, clientGroupID, user!),
            );

            const allNotes = await trx
              .selectFrom("note")
              .selectAll()
              .where("user_id", "=", user!.id)
              .execute();
            const allBlocks = await trx
              .selectFrom("block")
              .selectAll()
              .where("user_id", "=", user!.id)
              .execute();

            const nextCVR = await trx
              .insertInto("client_view_record")
              .values({
                user_id: user!.id,
                data: {
                  notes: allNotes.map((n) => n.id),
                  blocks: allBlocks.map((b) => b.id),
                },
              })
              .returning("id")
              .executeTakeFirstOrThrow();
            const nextVersion = Number(nextCVR.id);

            const changedNotes = await trx
              .selectFrom("note")
              .selectAll()
              .where("user_id", "=", user!.id)
              .where("version", ">", fromVersion)
              .execute();
            const changedBlocks = await trx
              .selectFrom("block")
              .selectAll()
              .where("user_id", "=", user!.id)
              .where("version", ">", fromVersion)
              .execute();

            const patch: Array<PullResponse["patch"][number]> = [];

            for (const note of changedNotes) {
              const parsedNote = Schema.decodeUnknownSync(NoteSchema)(note);
              patch.push({
                op: "put",
                key: `note/${note.id}`,
                value: parsedNote,
              });
            }
            for (const block of changedBlocks) {
              const parsedBlock = Schema.decodeUnknownSync(BlockSchema)(block);
              patch.push({
                op: "put",
                key: `block/${block.id}`,
                value: parsedBlock,
              });
            }

            if (fromVersion > 0) {
              const prevCVR = await trx
                .selectFrom("client_view_record")
                .select("data")
                .where("id", "=", String(fromVersion) as ClientViewRecordId)
                .where("user_id", "=", user!.id)
                .executeTakeFirst();

              if (prevCVR) {
                const prevData = prevCVR.data as {
                  notes: string[];
                  blocks: string[];
                };
                const prevNoteIds = new Set(prevData.notes);
                const prevBlockIds = new Set(prevData.blocks);

                const currentNoteIds = new Set(allNotes.map((n) => n.id));
                const currentBlockIds = new Set(allBlocks.map((b) => b.id));

                for (const id of prevNoteIds) {
                  if (!currentNoteIds.has(id as NoteId)) {
                    patch.push({ op: "del", key: `note/${id}` });
                  }
                }
                for (const id of prevBlockIds) {
                  if (!currentBlockIds.has(id as BlockId)) {
                    patch.push({ op: "del", key: `block/${id}` });
                  }
                }
              }
            }

            await trx
              .updateTable("replicache_client_group")
              .set({ cvr_version: nextVersion })
              .where("id", "=", clientGroup.id)
              .execute();

            const response: PullResponse = {
              cookie: nextVersion,
              lastMutationID: client.last_mutation_id,
              patch,
            };
            return response;
          }),
        catch: (cause) => {
          console.error("Pull transaction failed", cause);
          return new AuthError({
            _tag: "InternalServerError",
            message: "Pull failed",
          });
        },
      }),
      Effect.flatMap(Schema.decodeUnknown(PullResponseSchema)),
    );

    return pullResult;
  });
