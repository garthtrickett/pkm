// src/features/replicache/push.ts
import { Data, Effect, Schema } from "effect";
import type { PushRequest } from "../../lib/shared/replicache-schemas";
import { Db } from "../../db/DbTag";
import { Auth, AuthError } from "../../lib/server/auth";
import type { ReplicacheClientId } from "../../types/generated/public/ReplicacheClient";
import type { ReplicacheClientGroupId } from "../../types/generated/public/ReplicacheClientGroup";
import type { Database } from "../../types";
import type { Kysely } from "kysely";
import { PokeService } from "../../lib/server/PokeService";
import type { User } from "../../lib/shared/schemas";
// ✅ IMPORT: Import mutation handlers and schemas from the new, dedicated file.
import {
  CreateNoteArgsSchema,
  DeleteNoteArgsSchema,
  UpdateNoteArgsSchema,
  handleCreateNote,
  handleDeleteNote,
  handleUpdateNote,
} from "../note/note.mutations";

class PushTransactionError extends Data.TaggedError("PushTransactionError")<{
  readonly cause: unknown;
}> {}

// --- Mutation Logic (Now a simple dispatcher) ---
const applyMutation = (mutation: PushRequest["mutations"][number]) =>
  Effect.gen(function* () {
    switch (mutation.name) {
      case "createNote": {
        const args = yield* Schema.decodeUnknown(CreateNoteArgsSchema)(
          mutation.args,
        );
        yield* handleCreateNote(args);
        break;
      }
      case "updateNote": {
        const args = yield* Schema.decodeUnknown(UpdateNoteArgsSchema)(
          mutation.args,
        );
        yield* handleUpdateNote(args);
        break;
      }
      case "deleteNote": {
        const args = yield* Schema.decodeUnknown(DeleteNoteArgsSchema)(
          mutation.args,
        );
        yield* handleDeleteNote(args);
        break;
      }
      default:
        yield* Effect.logWarning(`Unknown mutation received: ${mutation.name}`);
    }
  });

/**
 * An Effect that encapsulates the logic for processing a batch of mutations.
 * It expects the `Db` service in its context to be a Kysely transaction object.
 * This function is pure and describes the transaction's steps without executing them.
 */
const processMutations = (
  mutations: PushRequest["mutations"],
  clientGroupID: PushRequest["clientGroupID"],
  user: User,
): Effect.Effect<void, Error, Db> =>
  Effect.forEach(
    mutations,
    (mutation) =>
      Effect.gen(function* (_) {
        const trx = yield* _(Db); // Expects a transaction to be provided as the Db service
        const { clientID, id: mutationID } = mutation;

        // Get or create client state
        let clientState = yield* _(
          Effect.promise(() =>
            trx
              .selectFrom("replicache_client")
              .selectAll()
              .where("id", "=", clientID as ReplicacheClientId)
              .forUpdate()
              .executeTakeFirst(),
          ),
        );

        if (!clientState) {
          yield* _(
            Effect.promise(() =>
              trx
                .insertInto("replicache_client")
                .values({
                  id: clientID as ReplicacheClientId,
                  client_group_id: clientGroupID as ReplicacheClientGroupId,
                  last_mutation_id: 0,
                  updated_at: new Date(),
                })
                .execute(),
            ),
          );
          clientState = yield* _(
            Effect.promise(() =>
              trx
                .selectFrom("replicache_client")
                .selectAll()
                .where("id", "=", clientID as ReplicacheClientId)
                .forUpdate()
                .executeTakeFirstOrThrow(),
            ),
          );
        }

        const expectedMutationID = clientState.last_mutation_id + 1;

        if (mutationID < expectedMutationID) {
          return; // Already processed, continue
        }

        if (mutationID > expectedMutationID) {
          return yield* _(
            Effect.fail(
              new Error(
                `Mutation ${mutationID} out of order for client ${clientID}; expected ${expectedMutationID}`,
              ),
            ),
          );
        }

        // Apply the specific mutation logic
        yield* _(
          applyMutation(mutation).pipe(
            Effect.provideService(Auth, { user, session: null }),
          ),
        );

        // Update the client's mutation ID
        yield* _(
          Effect.promise(() =>
            trx
              .updateTable("replicache_client")
              .set({ last_mutation_id: mutationID })
              .where("id", "=", clientID as ReplicacheClientId)
              .execute(),
          ),
        );
      }),
    { concurrency: 1, discard: true }, // Process mutations sequentially
  );

/**
 * Handles a Replicache push request by processing mutations within a database transaction.
 * This function orchestrates getting dependencies, defining the transactional logic,
 * executing it, and triggering a poke on success.
 */
export const handlePush = (
  req: PushRequest,
): Effect.Effect<void, AuthError, Db | Auth | PokeService> =>
  Effect.gen(function* (_) {
    const { clientGroupID, mutations } = req;
    if (mutations.length === 0) {
      return;
    }

    const db = yield* _(Db);
    const { user } = yield* _(Auth);
    const pokeService = yield* _(PokeService);

    yield* _(
      Effect.logInfo(
        { clientGroupID, mutationCount: mutations.length },
        "Processing V1 push request",
      ),
    );

    const mutationsEffect = processMutations(mutations, clientGroupID, user!);

    const transactionEffect = Effect.tryPromise({
      try: () =>
        db
          .transaction()
          .execute(async (trx) =>
            Effect.runPromise(
              mutationsEffect.pipe(
                Effect.provideService(Db, trx as Kysely<Database>),
              ),
            ),
          ),
      catch: (cause) => new PushTransactionError({ cause }),
    });

    yield* _(
      transactionEffect.pipe(
        Effect.catchTag("PushTransactionError", (internalError) =>
          // 1. Log the full, detailed error for debugging.
          Effect.logError("Push transaction failed with an error.", {
            error: internalError,
          }).pipe(
            // 2. Map it to a generic, safe error to send to the client.
            Effect.andThen(
              Effect.fail(
                new AuthError({
                  _tag: "InternalServerError",
                  message: "Your changes could not be saved.",
                }),
              ),
            ),
          ),
        ),
      ),
    );

    yield* _(pokeService.poke(user!.id));
  });
