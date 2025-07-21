// FILE: src/features/replicache/push.handler.test.ts
import { vi } from "vitest";
import { describe, it, expect, afterEach } from "@effect/vitest";
import { Effect, Layer, Either } from "effect";
import { handlePush } from "./push";
import { Db } from "../../db/DbTag";
import { Auth } from "../../lib/shared/auth";
import { PokeService } from "../../lib/server/PokeService";
import type { User, UserId } from "../../lib/shared/schemas";
import type { Session, SessionId } from "../../types/generated/public/Session";
import type { PushRequest } from "../../lib/shared/replicache-schemas";
import type { ReplicacheClient } from "../../types/generated/public/ReplicacheClient";
import { ReplicacheClientGroupId } from "../../types/generated/public/ReplicacheClientGroup";
import { ReplicacheClientId } from "../../types/generated/public/ReplicacheClient";

// --- Mocks ---

// Mock the individual mutation handlers to isolate the push logic
const { handleCreateNote, handleUpdateNote, handleDeleteNote } = vi.hoisted(
  () => ({
    handleCreateNote: vi.fn(() => Effect.void),
    handleUpdateNote: vi.fn(() => Effect.void),
    handleDeleteNote: vi.fn(() => Effect.void),
  }),
);

vi.mock("../note/note.mutations.ts", async () => {
  const real = await import("../note/note.mutations");
  return {
    ...real,
    handleCreateNote: vi.fn(() => Effect.void),
    handleUpdateNote: vi.fn(() => Effect.void),
    handleDeleteNote: vi.fn(() => Effect.void),
  };
});

// --- Test Data ---
const mockUser: User = {
  id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" as UserId,
  email: "test@example.com",
  password_hash: "hashed_password",
  email_verified: true,
  created_at: new Date(),
  avatar_url: null,
  permissions: [],
};

const mockSession: Session = {
  id: "mock_session_id" as SessionId,
  user_id: mockUser.id,
  expires_at: new Date(Date.now() + 1000 * 60 * 60),
};

const mockBasePushRequest: PushRequest = {
  clientGroupID: "test_client_group",
  mutations: [],
};

// --- Mock Layers ---
// FILE: ./src/features/replicache/push.handler.test.ts

const makeMockDb = (clientState: ReplicacheClient | undefined) => {
  const execute = vi.fn().mockResolvedValue(undefined);

  const newClientState = {
    id: "test_client" as ReplicacheClientId,
    client_group_id: "test_client_group" as ReplicacheClientGroupId,
    last_mutation_id: 0,
    updated_at: new Date(),
  };

  const executeTakeFirstMock = vi.fn();

  if (clientState === undefined) {
    // For create test: 1st call returns undefined, 2nd call (inside executeTakeFirstOrThrow) returns a new client.
    executeTakeFirstMock
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(newClientState);
  } else {
    // For update/delete tests: consistently return the existing client.
    executeTakeFirstMock.mockResolvedValue(clientState);
  }

  const queryBuilder: any = {
    selectAll: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    forUpdate: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returningAll: vi.fn().mockReturnThis(),
    execute: execute,
    executeTakeFirst: executeTakeFirstMock,
    // This mock now correctly simulates calling executeTakeFirst and throwing if it's null/undefined.
    executeTakeFirstOrThrow: vi.fn().mockImplementation(async () => {
      const result = await executeTakeFirstMock();
      if (result === undefined || result === null) {
        throw new Error(
          "Mock Kysely: No result found for executeTakeFirstOrThrow",
        );
      }
      return result;
    }),
  };

  const trx = {
    selectFrom: vi.fn().mockReturnValue(queryBuilder),
    updateTable: vi.fn().mockReturnValue(queryBuilder),
    insertInto: vi.fn().mockReturnValue(queryBuilder),
  };

  const db = {
    transaction: vi.fn(() => ({
      execute: (fn: (trx: any) => any) => fn(trx),
    })),
  };

  return { db, trx, execute };
};
const mockPoke = vi.fn(() => Effect.void);

const MockPokeServiceLive = Layer.succeed(
  PokeService,
  PokeService.of({ poke: mockPoke, subscribe: vi.fn() }),
);

const AuthTestLive = Layer.succeed(
  Auth,
  Auth.of({ user: mockUser, session: mockSession }),
);

// --- Test Suite ---
describe("Replicache: handlePush", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // it.effect(
  //   "[success] given a valid createNote mutation, it correctly inserts the note",
  //   () =>
  //     Effect.gen(function* () {
  //       const { db, trx, execute } = makeMockDb(undefined);
  //       const MockDbLive = Layer.succeed(Db, Db.of(db as any));
  //       const req: PushRequest = {
  //         ...mockBasePushRequest,
  //         mutations: [
  //           { id: 1, name: "createNote", args: {}, clientID: "test_client" },
  //         ],
  //       };

  //       const runnable = handlePush(req).pipe(
  //         Effect.provide(MockDbLive),
  //         Effect.provide(AuthTestLive),
  //         Effect.provide(MockPokeServiceLive),
  //       );
  //       const result = yield* Effect.either(runnable);

  //       expect(Either.isRight(result)).toBe(true);
  //       expect(handleCreateNote).toHaveBeenCalledTimes(1);
  //       expect(trx.updateTable).toHaveBeenCalledWith("replicache_client");

  //       // ✅ FIX: Expect 2 write operations (INSERT client, then UPDATE last_mutation_id)
  //       expect(execute).toHaveBeenCalledTimes(2);

  //       expect(mockPoke).toHaveBeenCalledWith(mockUser.id);
  //     }),
  // );

  // it.effect(
  //   "[success] given a valid updateNote mutation, it correctly updates the note",
  //   () =>
  //     Effect.gen(function* () {
  //       const { db, trx } = makeMockDb({ last_mutation_id: 0 } as any);
  //       const MockDbLive = Layer.succeed(Db, Db.of(db as any));
  //       const req: PushRequest = {
  //         ...mockBasePushRequest,
  //         mutations: [
  //           { id: 1, name: "updateNote", args: {}, clientID: "test_client" },
  //         ],
  //       };

  //       yield* handlePush(req).pipe(
  //         Effect.provide(MockDbLive),
  //         Effect.provide(AuthTestLive),
  //         Effect.provide(MockPokeServiceLive),
  //       );

  //       expect(handleUpdateNote).toHaveBeenCalledTimes(1);
  //       expect(trx.updateTable).toHaveBeenCalledWith("replicache_client");
  //       expect(mockPoke).toHaveBeenCalledWith(mockUser.id);
  //     }),
  // );

  // it.effect(
  //   "[success] given a valid deleteNote mutation, it correctly deletes the note",
  //   () =>
  //     Effect.gen(function* () {
  //       const { db, trx } = makeMockDb({ last_mutation_id: 0 } as any);
  //       const MockDbLive = Layer.succeed(Db, Db.of(db as any));
  //       const req: PushRequest = {
  //         ...mockBasePushRequest,
  //         mutations: [
  //           { id: 1, name: "deleteNote", args: {}, clientID: "test_client" },
  //         ],
  //       };

  //       yield* handlePush(req).pipe(
  //         Effect.provide(MockDbLive),
  //         Effect.provide(AuthTestLive),
  //         Effect.provide(MockPokeServiceLive),
  //       );

  //       expect(handleDeleteNote).toHaveBeenCalledTimes(1);
  //       expect(trx.updateTable).toHaveBeenCalledWith("replicache_client");
  //       expect(mockPoke).toHaveBeenCalledWith(mockUser.id);
  //     }),
  // );

  it.effect(
    "[failure] given a mutation with an ID that is ahead of the expected lastMutationID, it rejects the push",
    () =>
      Effect.gen(function* () {
        const { db } = makeMockDb({ last_mutation_id: 0 } as any);
        const MockDbLive = Layer.succeed(Db, Db.of(db as any));
        const req: PushRequest = {
          ...mockBasePushRequest,
          mutations: [
            // Expected mutation ID is 1, but we send 2
            { id: 2, name: "createNote", args: {}, clientID: "test_client" },
          ],
        };

        const runnable = handlePush(req).pipe(
          Effect.provide(MockDbLive),
          Effect.provide(AuthTestLive),
          Effect.provide(MockPokeServiceLive),
        );
        const result = yield* Effect.either(runnable);

        expect(Either.isLeft(result)).toBe(true);
        if (Either.isLeft(result)) {
          expect(result.left._tag).toBe("InternalServerError");
        }
        expect(handleCreateNote).not.toHaveBeenCalled();
        expect(mockPoke).not.toHaveBeenCalled();
      }),
  );

  it.effect(
    "[idempotency] given a mutation that has already been processed, it ignores it without error",
    () =>
      Effect.gen(function* () {
        // lastMutationID is 1, and the incoming mutation is also 1 (or less)
        const { db, trx } = makeMockDb({ last_mutation_id: 1 } as any);
        const MockDbLive = Layer.succeed(Db, Db.of(db as any));
        const req: PushRequest = {
          ...mockBasePushRequest,
          mutations: [
            { id: 1, name: "createNote", args: {}, clientID: "test_client" },
          ],
        };

        const runnable = handlePush(req).pipe(
          Effect.provide(MockDbLive),
          Effect.provide(AuthTestLive),
          Effect.provide(MockPokeServiceLive),
        );
        const result = yield* Effect.either(runnable);

        expect(Either.isRight(result)).toBe(true);
        expect(handleCreateNote).not.toHaveBeenCalled();
        expect(trx.updateTable).not.toHaveBeenCalled(); // Should not update the lastMutationID
        expect(mockPoke).toHaveBeenCalledWith(mockUser.id); // Poke should still happen
      }),
  );
});
