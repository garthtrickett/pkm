// src/features/replicache/push.ts
import { Effect, Schema } from "effect";
import type { PushRequest } from "../../lib/shared/replicache-schemas";
import { sql } from "kysely";
import { Db } from "../../db/DbTag";
import { Auth } from "../../lib/server/auth";
import { NoteIdSchema, UserIdSchema } from "../../lib/shared/schemas";
import type { NewNote } from "../../types/generated/public/Note";
import type { ReplicacheClientId } from "../../types/generated/public/ReplicacheClient";
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
        // ✅ FIX: The 'note' table has a NOT NULL 'content' column.
        // We must provide a default value for it on creation.
        const newNote: NewNote = {
          id: args.id,
          title: args.title,
          content: "", // Start with empty content
          user_id: user!.id,
          version: 1,
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

// 🔄 MODIFIED: Correctly handle transaction errors and trigger poke
export const handlePush = (
  req: PushRequest,
): Effect.Effect<void, never, Db | Auth | PokeService> =>
  Effect.gen(function* (_) {
    const { clientGroupID, mutations } = req;
    if (mutations.length === 0) return;

    const db = yield* _(Db);
    const { user } = yield* _(Auth);
    const pokeService = yield* _(PokeService);

    yield* _(
      Effect.logInfo(
        { clientGroupID, mutationCount: mutations.length },
        "Processing push request",
      ),
    );

    const transactionEffect = Effect.promise(() =>
      db.transaction().execute(async (trx) => {
        const clientID = `${clientGroupID}-${user!.id}`;
        const clientState = await trx
          .selectFrom("replicache_client")
          .selectAll()
          .where("id", "=", clientID as ReplicacheClientId)
          .forUpdate()
          .executeTakeFirst();

        if (!clientState) {
          throw new Error(`Client state not found for id: ${clientID}`);
        }

        for (const mutation of mutations) {
          const expectedMutationID = clientState.last_mutation_id + 1;
          if (mutation.id < expectedMutationID) {
            continue;
          }
          if (mutation.id > expectedMutationID) {
            throw new Error(
              `Mutation ${mutation.id} out of order; expected ${expectedMutationID}`,
            );
          }
          const mutationEffect = applyMutation(mutation);
          await Effect.runPromise(
            mutationEffect.pipe(
              Effect.provideService(Db, trx as Kysely<Database>),
              Effect.provideService(Auth, { user: user!, session: null }),
            ),
          );
          clientState.last_mutation_id = mutation.id;
        }
        await trx
          .updateTable("replicache_client")
          .set({ last_mutation_id: clientState.last_mutation_id })
          .where("id", "=", clientID as ReplicacheClientId)
          .execute();
      }),
    );

    // This is the fix. We match on the outcome of the transaction effect.
    yield* transactionEffect.pipe(
      Effect.matchEffect({
        onSuccess: () => {
          // If the transaction succeeded, poke other clients.
          return pokeService.poke(user!.id);
        },
        onFailure: (error) => {
          // If it failed, log the error.
          return Effect.logError("Transaction failed during push", { error });
        },
      }),
    );
  });
