// src/features/replicache/push.ts
import { Effect, Schema } from "effect";
import type { PushRequest } from "../../lib/shared/replicache-schemas";
import { sql } from "kysely";
import { Db } from "../../db/DbTag";
import { Auth } from "../../lib/server/auth";
import { NoteIdSchema } from "../../lib/shared/schemas";
import type { NewNote } from "../../types/generated/public/Note";
import type { ReplicacheClientId } from "../../types/generated/public/ReplicacheClient";
import type { ReplicacheClientGroupId } from "../../types/generated/public/ReplicacheClientGroup";
import { Database } from "../../types";
import { Kysely } from "kysely";

// --- Mutation-specific argument schemas for validation ---
const CreateNoteArgsSchema = Schema.Struct({
  id: NoteIdSchema,
  title: Schema.String,
  content: Schema.String,
});

const UpdateNoteContentArgsSchema = Schema.Struct({
  id: NoteIdSchema,
  content: Schema.String,
});

// A helper function to apply a single mutation within a transaction.
const applyMutation = (mutation: PushRequest["mutations"][number]) =>
  Effect.gen(function* (_) {
    const db = yield* _(Db);
    const { user } = yield* _(Auth);

    switch (mutation.name) {
      case "createNote": {
        const args = yield* _(
          Schema.decodeUnknown(CreateNoteArgsSchema)(mutation.args),
        );
        const newNote: NewNote = {
          id: args.id,
          title: args.title,
          content: args.content,
          user_id: user!.id, // `user` is guaranteed by Auth middleware
          version: 1,
        };
        yield* _(
          Effect.promise(() => db.insertInto("note").values(newNote).execute()),
        );
        break;
      }

      case "updateNoteContent": {
        const args = yield* _(
          Schema.decodeUnknown(UpdateNoteContentArgsSchema)(mutation.args),
        );
        yield* _(
          Effect.promise(() =>
            db
              .updateTable("note")
              .set({
                content: args.content,
                version: sql`version + 1`,
              })
              .where("id", "=", args.id)
              .where("user_id", "=", user!.id) // Security check
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

export const handlePush = (
  req: PushRequest,
): Effect.Effect<void, never, Db | Auth> =>
  Effect.gen(function* (_) {
    const { clientGroupID, mutations } = req;
    const db = yield* _(Db);
    const { user } = yield* _(Auth);

    yield* _(
      Effect.logInfo(
        { clientGroupID, mutationCount: mutations.length },
        "Processing push request",
      ),
    );

    yield* _(
      Effect.promise(() =>
        db.transaction().execute(async (trx) => {
          for (const mutation of mutations) {
            // ✅ **FIX: Use a type assertion to inform TypeScript of the object's shape.**
            // This satisfies the `no-unsafe-assignment` linting rule for `args`.
            const {
              id: mutationID,
              name,
              args,
            } = mutation as {
              id: number;
              name: string;
              args: unknown;
            };

            const clientState = await trx
              .selectFrom("replicache_client")
              .selectAll()
              .where(
                "id",
                "=",
                `${clientGroupID}-${user!.id}` as ReplicacheClientId,
              )
              .forUpdate()
              .executeTakeFirst();

            if (!clientState) {
              throw new Error(
                `Client state not found for id: ${clientGroupID}`,
              );
            }

            const expectedMutationID = clientState.last_mutation_id + 1;

            if (mutationID < expectedMutationID) {
              await Effect.runPromise(
                Effect.logInfo(
                  { clientGroupID, mutationID, expectedMutationID },
                  "Skipping already processed mutation",
                ),
              );
              continue;
            }

            if (mutationID > expectedMutationID) {
              throw new Error(
                `Mutation ${mutationID} is out of order; expected ${expectedMutationID}`,
              );
            }

            const mutationEffect = applyMutation(mutation);
            await Effect.runPromise(
              mutationEffect.pipe(
                Effect.provideService(Db, trx as Kysely<Database>),
                Effect.provideService(Auth, { user: user!, session: null }),
              ),
            );

            await trx
              .insertInto("change_log")
              .values({
                client_group_id: clientGroupID as ReplicacheClientGroupId,
                client_id: `${clientGroupID}-${user!.id}` as ReplicacheClientId,
                mutation_id: mutationID,
                name,
                args,
              })
              .execute();

            await trx
              .updateTable("replicache_client")
              .set({ last_mutation_id: mutationID })
              .where("id", "=", clientState.id)
              .execute();
          }
        }),
      ),
      Effect.catchAll((error) =>
        Effect.logError("Transaction failed during push", { error }),
      ),
    );

    return; // Return void on success
  });
