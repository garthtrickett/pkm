// src/features/replicache/pull.ts
import { Effect, Schema } from "effect";
import {
  type PullRequest,
  type PullResponse,
} from "../../lib/shared/replicache-schemas";
import { Db } from "../../db/DbTag";
import { Auth, AuthError } from "../../lib/server/auth";
import { BlockIdSchema, NoteIdSchema } from "../../lib/shared/schemas";
import type { ReplicacheClientGroupId } from "../../types/generated/public/ReplicacheClientGroup";
import type { ClientViewRecordId } from "../../types/generated/public/ClientViewRecord";

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
            // Fetch all clients for the group to build the lastMutationIDChanges map.
            const clients = await trx
              .selectFrom("replicache_client")
              .selectAll()
              .where(
                "client_group_id",
                "=",
                clientGroupID as ReplicacheClientGroupId,
              )
              .execute();

            const lastMutationIDChanges = Object.fromEntries(
              clients.map((c) => [c.id, c.last_mutation_id]),
            );

            // Get a snapshot of all current entities for the user.
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
            // Create a new Client View Record (CVR) for this sync and get its version (ID).
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

            // --- THIS IS THE FIX ---
            // 1. Get the timestamp of the last pull. If it's the first pull, use the epoch.
            let lastPullTimestamp = new Date(0);
            if (fromVersion > 0) {
              const prevCVR = await trx
                .selectFrom("client_view_record")
                .select("created_at")
                .where("id", "=", fromVersion as ClientViewRecordId)
                .where("user_id", "=", user!.id)
                .executeTakeFirst();

              if (prevCVR) {
                lastPullTimestamp = prevCVR.created_at;
              }
            }

            // 2. Find all entities that have changed since the client's last pull timestamp.
            const changedNotes = await trx
              .selectFrom("note")
              .selectAll()
              .where("user_id", "=", user!.id)
              .where("updated_at", ">", lastPullTimestamp)
              .execute();
            const changedBlocks = await trx
              .selectFrom("block")
              .selectAll()
              .where("user_id", "=", user!.id)
              .where("updated_at", ">", lastPullTimestamp)
              .execute();
            // --- END OF FIX ---

            const patch: Array<PullResponse["patch"][number]> = [];

            // Add new or updated notes to the patch.
            for (const note of changedNotes) {
              patch.push({
                op: "put",
                key: `note/${note.id}`,
                value: {
                  _tag: "note",
                  id: note.id,
                  user_id: note.user_id,
                  title: note.title,
                  content: note.content,
                  version: note.version,
                  created_at: note.created_at.toISOString(),
                  updated_at: note.updated_at.toISOString(),
                },
              });
            }

            // Add new or updated blocks to the patch.
            for (const block of changedBlocks) {
              patch.push({
                op: "put",
                key: `block/${block.id}`,
                value: {
                  _tag: "block",
                  id: block.id,
                  user_id: block.user_id,
                  note_id: block.note_id,
                  type: block.type,
                  content: block.content,
                  fields: block.fields ?? {},
                  tags: block.tags,
                  links: block.links,
                  file_path: block.file_path,
                  parent_id: block.parent_id,
                  depth: block.depth,
                  order: block.order,
                  transclusions: block.transclusions,
                  version: block.version,
                  created_at: block.created_at.toISOString(),
                  updated_at: block.updated_at.toISOString(),
                },
              });
            }

            // Calculate deletions if the client is not syncing for the first time.
            if (fromVersion > 0) {
              const prevCVR = await trx
                .selectFrom("client_view_record")
                .select("data")
                .where("id", "=", fromVersion as ClientViewRecordId)
                .where("user_id", "=", user!.id)
                .executeTakeFirst();

              if (prevCVR) {
                const CvrDataSchema = Schema.Struct({
                  notes: Schema.Array(NoteIdSchema),
                  blocks: Schema.Array(BlockIdSchema),
                });
                const prevData = Schema.decodeUnknownSync(CvrDataSchema)(
                  prevCVR.data,
                );
                const prevNoteIds = new Set(prevData.notes);
                const prevBlockIds = new Set(prevData.blocks);

                const currentNoteIds = new Set(allNotes.map((n) => n.id));
                const currentBlockIds = new Set(allBlocks.map((b) => b.id));

                for (const id of prevNoteIds) {
                  if (!currentNoteIds.has(id)) {
                    patch.push({ op: "del", key: `note/${id}` });
                  }
                }
                for (const id of prevBlockIds) {
                  if (!currentBlockIds.has(id)) {
                    patch.push({ op: "del", key: `block/${id}` });
                  }
                }
              }
            }

            const response: PullResponse = {
              cookie: nextVersion,
              lastMutationIDChanges,
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
    );

    return pullResult;
  });
