// src/features/replicache/pull.ts

import { Effect, Schema, Data } from "effect";
import {
  type PullRequest,
  type PullResponse,
} from "../../lib/shared/replicache-schemas";
import { Db } from "../../db/DbTag";
import { Auth, AuthError } from "../../lib/server/auth";
import {
  BlockIdSchema,
  NoteIdSchema,
  type User,
} from "../../lib/shared/schemas";
import type { ReplicacheClientGroupId } from "../../types/generated/public/ReplicacheClientGroup";
import type { ClientViewRecordId } from "../../types/generated/public/ClientViewRecord";
import type { Transaction } from "kysely";
import type { Database } from "../../types";

class PullDatabaseError extends Data.TaggedError("PullDatabaseError")<{
  readonly cause: unknown;
}> {}

const pullLogicEffect = (
  trx: Transaction<Database>,
  req: PullRequest,
  user: User,
): Effect.Effect<PullResponse, PullDatabaseError> =>
  Effect.gen(function* () {
    // ... (This function's implementation remains the same)
    const { clientGroupID, cookie } = req;
    const fromVersion = cookie ?? 0;

    const clients = yield* Effect.tryPromise({
      try: () =>
        trx
          .selectFrom("replicache_client")
          .selectAll()
          .where(
            "client_group_id",
            "=",
            clientGroupID as ReplicacheClientGroupId,
          )
          .execute(),
      catch: (cause) => new PullDatabaseError({ cause }),
    });

    const lastMutationIDChanges = Object.fromEntries(
      clients.map((c) => [c.id, c.last_mutation_id]),
    );

    const [allNotes, allBlocks] = yield* Effect.all([
      Effect.tryPromise({
        try: () =>
          trx
            .selectFrom("note")
            .selectAll()
            .where("user_id", "=", user.id)
            .execute(),
        catch: (cause) => new PullDatabaseError({ cause }),
      }),
      Effect.tryPromise({
        try: () =>
          trx
            .selectFrom("block")
            .selectAll()
            .where("user_id", "=", user.id)
            .execute(),
        catch: (cause) => new PullDatabaseError({ cause }),
      }),
    ]);

    const nextCVR = yield* Effect.tryPromise({
      try: () =>
        trx
          .insertInto("client_view_record")
          .values({
            user_id: user.id,
            data: {
              notes: allNotes.map((n) => n.id),
              blocks: allBlocks.map((b) => b.id),
            },
          })
          .returning("id")
          .executeTakeFirstOrThrow(),
      catch: (cause) => new PullDatabaseError({ cause }),
    });
    const nextVersion = Number(nextCVR.id);

    const lastPullTimestamp = yield* Effect.if(fromVersion > 0, {
      onTrue: () =>
        Effect.tryPromise({
          try: () =>
            trx
              .selectFrom("client_view_record")
              .select("created_at")
              .where("id", "=", fromVersion as ClientViewRecordId)
              .where("user_id", "=", user.id)
              .executeTakeFirst(),
          catch: (cause) => new PullDatabaseError({ cause }),
        }).pipe(Effect.map((cvr) => cvr?.created_at ?? new Date(0))),
      onFalse: () => Effect.succeed(new Date(0)),
    });

    const [changedNotes, changedBlocks] = yield* Effect.all([
      Effect.tryPromise({
        try: () =>
          trx
            .selectFrom("note")
            .selectAll()
            .where("user_id", "=", user.id)
            .where("updated_at", ">", lastPullTimestamp)
            .execute(),
        catch: (cause) => new PullDatabaseError({ cause }),
      }),
      Effect.tryPromise({
        try: () =>
          trx
            .selectFrom("block")
            .selectAll()
            .where("user_id", "=", user.id)
            .where("updated_at", ">", lastPullTimestamp)
            .execute(),
        catch: (cause) => new PullDatabaseError({ cause }),
      }),
    ]);

    const patch: Array<PullResponse["patch"][number]> = [];

    changedNotes.forEach((note) =>
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
      }),
    );

    changedBlocks.forEach((block) =>
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
      }),
    );

    if (fromVersion > 0) {
      const prevCVR = yield* Effect.tryPromise({
        try: () =>
          trx
            .selectFrom("client_view_record")
            .select("data")
            .where("id", "=", fromVersion as ClientViewRecordId)
            .where("user_id", "=", user.id)
            .executeTakeFirst(),
        catch: (cause) => new PullDatabaseError({ cause }),
      });
      if (prevCVR) {
        const CvrDataSchema = Schema.Struct({
          notes: Schema.Array(NoteIdSchema),
          blocks: Schema.Array(BlockIdSchema),
        });
        const prevData = Schema.decodeUnknownSync(CvrDataSchema)(prevCVR.data);
        const currentNoteIds = new Set(allNotes.map((n) => n.id));
        prevData.notes.forEach((id) => {
          if (!currentNoteIds.has(id))
            patch.push({ op: "del", key: `note/${id}` });
        });
        const currentBlockIds = new Set(allBlocks.map((b) => b.id));
        prevData.blocks.forEach((id) => {
          if (!currentBlockIds.has(id))
            patch.push({ op: "del", key: `block/${id}` });
        });
      }
    }

    return { cookie: nextVersion, lastMutationIDChanges, patch };
  });

/**
 * The main request handler for a Replicache pull.
 * It orchestrates acquiring a database connection and executing the pull logic
 * within a single database transaction.
 */
export const handlePull = (
  req: PullRequest,
): Effect.Effect<PullResponse, AuthError, Db | Auth> =>
  Effect.all([
    Db,
    Auth,
    Effect.logInfo(
      { clientGroupID: req.clientGroupID, fromVersion: req.cookie ?? 0 },
      "Processing pull request",
    ),
  ]).pipe(
    Effect.flatMap(([db, { user }]) =>
      // ✅ THIS IS THE FIX ✅
      // Use Effect.tryPromise to correctly model a fallible promise.
      Effect.tryPromise({
        try: () =>
          db
            .transaction()
            .execute((trx) =>
              Effect.runPromise(pullLogicEffect(trx, req, user!)),
            ),
        // The catch block types the error channel of this Effect.
        catch: (cause) => new PullDatabaseError({ cause }),
      }),
    ),
    // Now that the effect has a typed error channel, catchTag works perfectly.
    Effect.catchTag("PullDatabaseError", (internalError) =>
      Effect.logError(
        "A database error occurred during the pull transaction.",
        { error: internalError },
      ).pipe(
        Effect.andThen(
          Effect.fail(
            new AuthError({
              _tag: "InternalServerError",
              message: "Pull failed due to a server error.",
            }),
          ),
        ),
      ),
    ),
  );
