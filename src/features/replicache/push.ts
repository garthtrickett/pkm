// src/features/replicache/push.ts
import { Effect, Schema } from "effect";
import type { PushRequest } from "../../lib/shared/replicache-schemas";
import { sql } from "kysely";
import { Db } from "../../db/DbTag";
import { Auth, AuthError } from "../../lib/server/auth";
import { NoteIdSchema, UserIdSchema } from "../../lib/shared/schemas";
import type { NewNote } from "../../types/generated/public/Note";
import type { ReplicacheClientId } from "../../types/generated/public/ReplicacheClient";
import type { ReplicacheClientGroupId } from "../../types/generated/public/ReplicacheClientGroup";
import { Database } from "../../types";
import { Kysely } from "kysely";
import { PokeService } from "../../lib/server/PokeService";
import type { User } from "../../lib/shared/schemas";

// --- Mutation Schemas ---
const CreateNoteArgsSchema = Schema.Struct({
  id: NoteIdSchema,
  userID: UserIdSchema, // Matches the client mutator
  title: Schema.String,
});

const UpdateNoteArgsSchema = Schema.Struct({
  id: NoteIdSchema,
  title: Schema.String,
  content: Schema.String,
});

const DeleteNoteArgsSchema = Schema.Struct({
  id: NoteIdSchema,
});

// --- Mutation Logic ---
const applyMutation = (mutation: PushRequest["mutations"][number]) =>
  Effect.gen(function* (_) {
    const db = yield* _(Db);
    const { user } = yield* _(Auth);

    switch (mutation.name) {
      case "createNote": {
        const args = yield* _(
          Schema.decodeUnknown(CreateNoteArgsSchema)(mutation.args),
        );
        const now = new Date();
        const newNote: NewNote = {
          id: args.id,
          title: args.title,
          content: "", // Start with empty content
          user_id: user!.id,
          version: 1,
          created_at: now,
          updated_at: now,
        };
        yield* _(
          Effect.promise(() => db.insertInto("note").values(newNote).execute()),
        );
        break;
      }
      case "updateNote": {
        const args = yield* _(
          Schema.decodeUnknown(UpdateNoteArgsSchema)(mutation.args),
        );
        yield* _(
          Effect.promise(() =>
            db
              .updateTable("note")
              .set({
                title: args.title,
                content: args.content,
                version: sql`version + 1`,
                updated_at: new Date(),
              })
              .where("id", "=", args.id)
              .where("user_id", "=", user!.id)
              .execute(),
          ),
        );
        break;
      }
      case "deleteNote": {
        const args = yield* _(
          Schema.decodeUnknown(DeleteNoteArgsSchema)(mutation.args),
        );
        yield* _(
          Effect.promise(() =>
            db
              .deleteFrom("note")
              .where("id", "=", args.id)
              .where("user_id", "=", user!.id)
              .execute(),
          ),
        );
        break;
      }
      default:
        yield* _(
          Effect.logWarning(`Unknown mutation received: ${mutation.name}`),
        );
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
  // ✅ FIX: Use the imported `User` type directly. This is cleaner and correct.
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

    // 1. Define the effect that contains our specific mutation logic.
    const mutationsEffect = processMutations(mutations, clientGroupID, user!);

    // 2. Create an effect that will run our logic within a database transaction.
    const transactionEffect = Effect.tryPromise({
      try: () =>
        db.transaction().execute(async (trx) =>
          // Run the effect, providing the transaction `trx` as the `Db` service
          // for the duration of its execution.
          Effect.runPromise(
            mutationsEffect.pipe(
              Effect.provideService(Db, trx as Kysely<Database>),
            ),
          ),
        ),
      catch: (cause) =>
        new AuthError({
          _tag: "InternalServerError",
          message:
            cause instanceof Error ? cause.message : "Transaction failed",
        }),
    });

    // 3. Execute the transaction and then poke connected clients.
    yield* _(transactionEffect);
    yield* _(pokeService.poke(user!.id));
  });
