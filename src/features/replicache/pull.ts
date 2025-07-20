// src/features/replicache/pull.ts
import { Effect, Schema } from "effect";
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

/**
 * A pure Effect that describes the logic of generating a pull response within a transaction.
 * It takes the transaction handle (`trx`) as a direct argument, making it independent of
 * the global `Db` service and easy to test.
 *
 * @param trx The Kysely transaction object.
 * @param req The original pull request.
 * @param user The authenticated user.
 * @returns An Effect that, when run, produces a PullResponse or fails with an Error.
 */
const pullLogicEffect = (
  trx: Transaction<Database>,
  req: PullRequest,
  user: User,
): Effect.Effect<PullResponse, Error> =>
  Effect.gen(function* () {
    const { clientGroupID, cookie } = req;
    const fromVersion = cookie ?? 0;

    const mapUnknownToError = (cause: unknown) => new Error(String(cause));

    const clients = yield* Effect.promise(() =>
      trx
        .selectFrom("replicache_client")
        .selectAll()
        .where("client_group_id", "=", clientGroupID as ReplicacheClientGroupId)
        .execute(),
    ).pipe(Effect.mapError(mapUnknownToError)); // ✅ FIX: Handle potential promise rejection.

    const lastMutationIDChanges = Object.fromEntries(
      clients.map((c) => [c.id, c.last_mutation_id]),
    );

    const [allNotes, allBlocks] = yield* Effect.all([
      Effect.promise(() =>
        trx
          .selectFrom("note")
          .selectAll()
          .where("user_id", "=", user.id)
          .execute(),
      ).pipe(Effect.mapError(mapUnknownToError)), // ✅ FIX: Handle potential promise rejection.
      Effect.promise(() =>
        trx
          .selectFrom("block")
          .selectAll()
          .where("user_id", "=", user.id)
          .execute(),
      ).pipe(Effect.mapError(mapUnknownToError)), // ✅ FIX: Handle potential promise rejection.
    ]);

    const nextCVR = yield* Effect.promise(() =>
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
    ).pipe(Effect.mapError(mapUnknownToError)); // ✅ FIX: Handle potential promise rejection.
    const nextVersion = Number(nextCVR.id);

    const lastPullTimestamp = yield* Effect.if(fromVersion > 0, {
      // ✅ FIX: Make the branches lazy by wrapping them in arrow functions.
      onTrue: () =>
        Effect.promise(() =>
          trx
            .selectFrom("client_view_record")
            .select("created_at")
            .where("id", "=", fromVersion as ClientViewRecordId)
            .where("user_id", "=", user.id)
            .executeTakeFirst(),
        ).pipe(
          Effect.map((cvr) => cvr?.created_at ?? new Date(0)),
          Effect.mapError(mapUnknownToError), // ✅ FIX: Handle rejection inside the lazy effect.
        ),
      onFalse: () => Effect.succeed(new Date(0)),
    });

    const [changedNotes, changedBlocks] = yield* Effect.all([
      Effect.promise(() =>
        trx
          .selectFrom("note")
          .selectAll()
          .where("user_id", "=", user.id)
          .where("updated_at", ">", lastPullTimestamp)
          .execute(),
      ).pipe(Effect.mapError(mapUnknownToError)), // ✅ FIX: Handle potential promise rejection.
      Effect.promise(() =>
        trx
          .selectFrom("block")
          .selectAll()
          .where("user_id", "=", user.id)
          .where("updated_at", ">", lastPullTimestamp)
          .execute(),
      ).pipe(Effect.mapError(mapUnknownToError)), // ✅ FIX: Handle potential promise rejection.
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
      const prevCVR = yield* Effect.promise(() =>
        trx
          .selectFrom("client_view_record")
          .select("data")
          .where("id", "=", fromVersion as ClientViewRecordId)
          .where("user_id", "=", user.id)
          .executeTakeFirst(),
      ).pipe(Effect.mapError(mapUnknownToError)); // ✅ FIX: Handle potential promise rejection.
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
  Effect.gen(function* (_) {
    const { clientGroupID, cookie } = req;
    yield* _(
      Effect.logInfo(
        { clientGroupID, fromVersion: cookie ?? 0 },
        "Processing pull request",
      ),
    );

    const db = yield* _(Db);
    const { user } = yield* _(Auth);

    return yield* _(
      Effect.tryPromise({
        try: () =>
          db
            .transaction()
            .execute((trx) =>
              Effect.runPromise(pullLogicEffect(trx, req, user!)),
            ),
        catch: (cause) => {
          console.error("Pull transaction failed", cause);
          return new AuthError({
            _tag: "InternalServerError",
            message: "Pull failed",
          });
        },
      }),
    );
  });
