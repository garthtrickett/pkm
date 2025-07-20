// src/features/replicache/pull.ts
import { Data, Effect, Schema } from "effect";
import type { Transaction } from "kysely";
import { Db } from "../../db/DbTag";
import { Auth, AuthError } from "../../lib/server/auth";
import { syncableEntities } from "../../lib/server/sync/sync.registry";
import { CvrDataSchema, type CvrData } from "../../lib/server/sync/sync.types";
import type {
  PullRequest,
  PullResponse,
} from "../../lib/shared/replicache-schemas";
import type { BlockId, NoteId, User } from "../../lib/shared/schemas";
import type { Database } from "../../types";
import type { ClientViewRecordId } from "../../types/generated/public/ClientViewRecord";
import type { ReplicacheClientGroupId } from "../../types/generated/public/ReplicacheClientGroup";

class PullDatabaseError extends Data.TaggedError("PullDatabaseError")<{
  readonly cause: unknown;
}> {}

const pullLogicEffect = (
  trx: Transaction<Database>,
  req: PullRequest,
  user: User,
): Effect.Effect<PullResponse, PullDatabaseError> =>
  Effect.gen(function* () {
    // ✅ --- THIS IS THE FIX ---
    // Ensure the client group exists before proceeding.
    // Using `onConflict...doNothing()` makes this an atomic "upsert".
    yield* Effect.tryPromise({
      try: () =>
        trx
          .insertInto("replicache_client_group")
          .values({
            id: req.clientGroupID as ReplicacheClientGroupId,
            user_id: user.id,
            cvr_version: 0, // A new group always starts at version 0
            updated_at: new Date(),
          })
          .onConflict((oc) => oc.column("id").doNothing())
          .execute(),
      catch: (cause) => new PullDatabaseError({ cause }),
    });
    // ✅ --- END OF FIX ---

    const fromVersion = req.cookie ?? 0;

    // 1. Get last mutation IDs for all clients in the group.
    const clients = yield* Effect.tryPromise({
      try: () =>
        trx
          .selectFrom("replicache_client")
          .selectAll()
          .where(
            "client_group_id",
            "=",
            req.clientGroupID as ReplicacheClientGroupId,
          )
          .execute(),
      catch: (cause) => new PullDatabaseError({ cause }),
    });
    const lastMutationIDChanges = Object.fromEntries(
      clients.map((c) => [c.id, c.last_mutation_id]),
    );

    // 2. Get all current entity IDs for the new CVR.
    const allCurrentIds = yield* Effect.all(
      syncableEntities.map((entity) =>
        entity.getAllIds(trx, user.id).pipe(
          Effect.map((ids) => ({
            key: entity.keyInCVR,
            ids,
          })),
        ),
      ),
    );

    // 3. Create and insert the new Client View Record.
    const newCVRData: CvrData = {
      notes: (allCurrentIds.find((item) => item.key === "notes")?.ids ??
        []) as NoteId[],
      blocks: (allCurrentIds.find((item) => item.key === "blocks")?.ids ??
        []) as BlockId[],
    };

    const nextCVR = yield* Effect.tryPromise({
      try: () =>
        trx
          .insertInto("client_view_record")
          .values({ user_id: user.id, data: newCVRData })
          .returning("id")
          .executeTakeFirstOrThrow(),
      catch: (cause) => new PullDatabaseError({ cause }),
    });
    const nextVersion = Number(nextCVR.id);

    // 4. Fetch the previous CVR and its timestamp to calculate changes.
    const { oldCVRData, lastPullTimestamp } = yield* Effect.if(
      fromVersion > 0,
      {
        onTrue: () =>
          Effect.tryPromise({
            try: () =>
              trx
                .selectFrom("client_view_record")
                .selectAll()
                .where("id", "=", fromVersion as ClientViewRecordId)
                .where("user_id", "=", user.id)
                .executeTakeFirst(),
            catch: (cause) => new PullDatabaseError({ cause }),
          }).pipe(
            Effect.map((cvr) => ({
              oldCVRData: cvr
                ? Schema.decodeUnknownSync(CvrDataSchema)(cvr.data)
                : undefined,
              lastPullTimestamp: cvr?.created_at ?? new Date(0),
            })),
          ),
        onFalse: () =>
          Effect.succeed({
            oldCVRData: undefined,
            lastPullTimestamp: new Date(0),
          }),
      },
    );

    // 5. Get patch operations from all registered entities in parallel.
    const patchOperations = yield* Effect.all(
      syncableEntities.map((entity) => {
        // ✅ THIS IS THE FIX ✅
        // We tell TypeScript to treat the array of branded IDs as a simple
        // `readonly string[]`, which the `Set` constructor can handle.
        const newIds = new Set(
          newCVRData[entity.keyInCVR] as readonly string[],
        );
        return entity.getPatchOperations(
          trx,
          user.id,
          lastPullTimestamp,
          oldCVRData,
          newIds,
        );
      }),
    );

    const finalPatch = patchOperations.flat();

    return { cookie: nextVersion, lastMutationIDChanges, patch: finalPatch };
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
      Effect.tryPromise({
        try: () =>
          db
            .transaction()
            .execute((trx) =>
              Effect.runPromise(pullLogicEffect(trx, req, user!)),
            ),
        catch: (cause) => new PullDatabaseError({ cause }),
      }),
    ),
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
