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
        // ✅ THIS IS THE FIX ✅
        // Explicitly set all fields, including timestamps, to ensure the record
        // is complete and matches what the client optimistically created.
        // This prevents race conditions or mismatches with DB defaults.
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

// 1. Change the return type to allow an AuthError to be returned.
// 2. Remove the internal matchEffect and let the transactionEffect propagate its failure.
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

    const transactionEffect = Effect.tryPromise({
      try: () =>
        db.transaction().execute(async (trx) => {
          for (const mutation of mutations) {
            const { clientID, id: mutationID } = mutation;

            // ✅ FIX: Implement "get or create" logic for the client state.
            let clientState = await trx
              .selectFrom("replicache_client")
              .selectAll()
              .where("id", "=", clientID as ReplicacheClientId)
              .forUpdate()
              .executeTakeFirst();

            // If the client doesn't exist, create it.
            if (!clientState) {
              await trx
                .insertInto("replicache_client")
                .values({
                  id: clientID as ReplicacheClientId,
                  client_group_id: clientGroupID as ReplicacheClientGroupId, // Use clientGroupID from the request
                  last_mutation_id: 0,
                  updated_at: new Date(),
                })
                .execute();
              // Re-fetch the newly created state to ensure we have it.
              clientState = await trx
                .selectFrom("replicache_client")
                .selectAll()
                .where("id", "=", clientID as ReplicacheClientId)
                .forUpdate()
                .executeTakeFirstOrThrow();
            }

            const expectedMutationID = clientState.last_mutation_id + 1;

            if (mutationID < expectedMutationID) {
              continue; // Already processed
            }
            if (mutationID > expectedMutationID) {
              throw new Error(
                `Mutation ${mutationID} out of order for client ${clientID}; expected ${expectedMutationID}`,
              );
            }

            await Effect.runPromise(
              applyMutation(mutation).pipe(
                Effect.provideService(Db, trx as Kysely<Database>),
                Effect.provideService(Auth, { user: user!, session: null }),
              ),
            );

            await trx
              .updateTable("replicache_client")
              .set({ last_mutation_id: mutationID })
              .where("id", "=", clientID as ReplicacheClientId)
              .execute();
          }
        }),
      catch: (cause) =>
        new AuthError({
          _tag: "InternalServerError",
          message:
            cause instanceof Error ? cause.message : "Transaction failed",
        }),
    });

    yield* transactionEffect;
    yield* pokeService.poke(user!.id);
  });
