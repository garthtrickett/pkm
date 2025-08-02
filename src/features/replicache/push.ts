// FILE: src/features/replicache/push.ts
import { Data, Effect, Schema } from "effect";
import type { PushRequest } from "../../lib/shared/replicache-schemas";
import { Db } from "../../db/DbTag";
import { Auth, AuthError } from "../../lib/server/auth";
import type { ReplicacheClientId } from "../../types/generated/public/ReplicacheClient";
import type { ReplicacheClientGroupId } from "../../types/generated/public/ReplicacheClientGroup";
import type { Database } from "../../types";
import type { Kysely } from "kysely";
import { PokeService } from "../../lib/server/PokeService";
import type { PublicUser } from "../../lib/shared/schemas";
import {
  CreateNoteArgsSchema,
  DeleteNoteArgsSchema,
  UpdateNoteArgsSchema,
  UpdateTaskArgsSchema, // ✅ ADDED
  handleCreateNote,
  handleDeleteNote,
  handleUpdateNote,
  handleUpdateTask, // ✅ ADDED
} from "../note/note.mutations";

class PushTransactionError extends Data.TaggedError("PushTransactionError")<{
  readonly cause: unknown;
}> {}

const applyMutation = (mutation: PushRequest["mutations"][number]) =>
  Effect.gen(function* () {
    yield* Effect.logInfo(`[push] Applying mutation: ${mutation.name}`, {
      mutationId: mutation.id,
      clientId: mutation.clientID,
    });
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
      case "updateTask": {
        const args = yield* Schema.decodeUnknown(UpdateTaskArgsSchema)(
          mutation.args,
        );
        yield* handleUpdateTask(args);
        break;
      }
      default:
        yield* Effect.logWarning(`Unknown mutation received: ${mutation.name}`);
    }
  });

const processMutations = (
  mutations: PushRequest["mutations"],
  clientGroupID: PushRequest["clientGroupID"],
  user: PublicUser,
): Effect.Effect<void, Error, Db> =>
  Effect.forEach(
    mutations,
    (mutation) =>
      Effect.gen(function* (_) {
        const trx = yield* _(Db);
        const { clientID, id: mutationID } = mutation;

        yield* Effect.logInfo(
          `[push] Processing mutation #${mutationID} for client ${clientID}`,
        );

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

        const lastMutationID = clientState?.last_mutation_id ?? 0;
        yield* Effect.logInfo(
          `[push] Client ${clientID} lastMutationID is ${lastMutationID}. Current mutationID is ${mutationID}.`,
        );

        if (!clientState) {
          yield* Effect.logInfo(
            `[push] Client ${clientID} not found. Creating new entry.`,
          );
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
          yield* Effect.logInfo(
            `[push] Mutation ${mutationID} already processed. Skipping.`,
          );
          return;
        }

        if (mutationID > expectedMutationID) {
          yield* Effect.logError(
            `[push] Mutation ${mutationID} out of order for client ${clientID}; expected ${expectedMutationID}. Failing transaction.`,
          );
          return yield* _(
            Effect.fail(
              new Error(
                `Mutation ${mutationID} out of order for client ${clientID}; expected ${expectedMutationID}`,
              ),
            ),
          );
        }

        yield* _(
          applyMutation(mutation).pipe(
            Effect.provideService(Auth, Auth.of({ user, session: null })),
          ),
        );

        yield* Effect.logInfo(
          `[push] Updating client ${clientID} last_mutation_id to ${mutationID}.`,
        );
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
    { concurrency: 1, discard: true },
  );

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
        "[push] Processing V1 push request",
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
        Effect.tap(() =>
          Effect.logInfo(
            `[push] Transaction for client group ${clientGroupID} successful.`,
          ),
        ),
        Effect.catchTag("PushTransactionError", (internalError) =>
          Effect.logError("Push transaction failed with an error.", {
            error: internalError,
          }).pipe(
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
