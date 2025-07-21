// FILE: src/features/replicache/pull.handler.test.ts

import { vi } from "vitest";

/**
 * Mock `sync.registry` **before** anything that imports it.
 * `vi.mock` is hoisted automatically, so this guarantees the
 * registry is mocked when other modules are evaluated.
 */
vi.mock("../../lib/server/sync/sync.registry", () => ({
  syncableEntities: [
    {
      keyInCVR: "notes",
      getAllIds: vi.fn(),
      getPatchOperations: vi.fn(),
    },
    {
      keyInCVR: "blocks",
      getAllIds: vi.fn(),
      getPatchOperations: vi.fn(),
    },
  ],
}));

import { describe, it, expect, afterEach, beforeEach } from "@effect/vitest";
import { Effect, Layer, Either } from "effect";

import { handlePull } from "./pull";
import { Db } from "../../db/DbTag";
import { Auth } from "../../lib/server/auth";
import type { SyncableEntity } from "../../lib/server/sync/sync.types";
import {
  type User,
  type UserId,
  type Note,
  NoteId,
} from "../../lib/shared/schemas";
import type { Session, SessionId } from "../../types/generated/public/Session";
import { type PullRequest } from "../../lib/shared/replicache-schemas";
import type { ClientViewRecordId } from "../../types/generated/public/ClientViewRecord";

/* ------------------------------------------------------------------ */
/*                           --- Test Data ---                        */
/* ------------------------------------------------------------------ */

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

const mockNote1: Note = {
  id: "note_1" as NoteId,
  user_id: mockUser.id,
  title: "First Note",
  content: "Content 1",
  version: 1,
  created_at: new Date("2025-01-01T10:00:00Z"),
  updated_at: new Date("2025-01-01T10:00:00Z"),
};

const mockNote2: Note = {
  id: "note_2" as NoteId,
  user_id: mockUser.id,
  title: "Second Note",
  content: "Content 2",
  version: 1,
  created_at: new Date("2025-01-02T10:00:00Z"),
  updated_at: new Date("2025-01-02T10:00:00Z"),
};

/* ------------------------------------------------------------------ */
/*                     --- Mock Layers & Helpers ---                  */
/* ------------------------------------------------------------------ */

const makeMockDb = () => {
  const mockTrx = {
    insertInto: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    onConflict: vi.fn().mockReturnThis(),
    column: vi.fn().mockReturnThis(),
    doNothing: vi.fn().mockReturnThis(),
    execute: vi.fn().mockResolvedValue(undefined),
    returning: vi.fn().mockReturnThis(),
    executeTakeFirst: vi.fn(),
    executeTakeFirstOrThrow: vi.fn(),
    selectFrom: vi.fn().mockReturnThis(),
    selectAll: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
  };
  const db = {
    transaction: vi.fn(() => ({
      execute: (fn: (trx: any) => any) => fn(mockTrx),
    })),
  };
  return { db, mockTrx };
};

const AuthTestLive = Layer.succeed(
  Auth,
  Auth.of({ user: mockUser, session: mockSession }),
);

/* ------------------------------------------------------------------ */
/*                          --- Test Suite ---                        */
/* ------------------------------------------------------------------ */

describe("Replicache: handlePull", () => {
  let mockedNoteSyncHandler: SyncableEntity;
  let mockedBlockSyncHandler: SyncableEntity;

  beforeEach(async () => {
    // The registry import resolves to the mocked version
    const registry = await import("../../lib/server/sync/sync.registry");
    const syncableEntities = registry.syncableEntities as SyncableEntity[];

    mockedNoteSyncHandler = syncableEntities[0]!;
    mockedBlockSyncHandler = syncableEntities[1]!;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // it.effect(
  //   "[success] for a first-time pull (cookie is null) returns all data and a new cookie",
  //   () =>
  //     Effect.gen(function* () {
  //       const { db, mockTrx } = makeMockDb();
  //       const MockDbLive = Layer.succeed(Db, Db.of(db as any));
  //       const req: PullRequest = {
  //         clientGroupID: "test_client_group",
  //         cookie: null,
  //       };

  //       // Arrange Mocks
  //       vi.mocked(mockedNoteSyncHandler.getAllIds).mockReturnValue(
  //         Effect.succeed([mockNote1.id, mockNote2.id]),
  //       );
  //       vi.mocked(mockedBlockSyncHandler.getAllIds).mockReturnValue(
  //         Effect.succeed([]),
  //       );
  //       vi.mocked(mockTrx.executeTakeFirstOrThrow).mockResolvedValue({
  //         id: 1 as ClientViewRecordId,
  //       });
  //       vi.mocked(mockedNoteSyncHandler.getPatchOperations).mockReturnValue(
  //         Effect.succeed([
  //           {
  //             op: "put",
  //             key: `note/${mockNote1.id}`,
  //             value: {
  //               _tag: "note",
  //               ...mockNote1,
  //               created_at: mockNote1.created_at.toISOString(),
  //               updated_at: mockNote1.updated_at.toISOString(),
  //             },
  //           },
  //           {
  //             op: "put",
  //             key: `note/${mockNote2.id}`,
  //             value: {
  //               _tag: "note",
  //               ...mockNote2,
  //               created_at: mockNote2.created_at.toISOString(),
  //               updated_at: mockNote2.updated_at.toISOString(),
  //             },
  //           },
  //         ]),
  //       );
  //       vi.mocked(mockedBlockSyncHandler.getPatchOperations).mockReturnValue(
  //         Effect.succeed([]),
  //       );

  //       // Act
  //       const result = yield* handlePull(req).pipe(
  //         Effect.provide(MockDbLive),
  //         Effect.provide(AuthTestLive),
  //         Effect.either,
  //       );

  //       // Assert
  //       expect(Either.isRight(result)).toBe(true);
  //       if (Either.isRight(result)) {
  //         expect(result.right.cookie).toBe(1);
  //         expect(result.right.patch).toHaveLength(2);
  //       }
  //     }),
  // );

  // it.effect(
  //   "[success] for a subsequent pull, returns only the data that has changed since the last pull",
  //   () =>
  //     Effect.gen(function* () {
  //       const { db, mockTrx } = makeMockDb();
  //       const MockDbLive = Layer.succeed(Db, Db.of(db as any));
  //       const req: PullRequest = {
  //         clientGroupID: "test_client_group",
  //         cookie: 1,
  //       };
  //       const lastPullTimestamp = new Date("2025-01-03T10:00:00Z");
  //       const updatedNote2 = { ...mockNote2, title: "Updated Title" };

  //       // Arrange Mocks
  //       vi.mocked(mockTrx.executeTakeFirst)
  //         // For fetching old CVR
  //         .mockResolvedValueOnce({
  //           id: 1,
  //           user_id: mockUser.id,
  //           data: { notes: [mockNote1.id, mockNote2.id], blocks: [] },
  //           created_at: lastPullTimestamp,
  //         });

  //       vi.mocked(mockTrx.executeTakeFirstOrThrow)
  //         // For creating new CVR
  //         .mockResolvedValueOnce({ id: 2 as ClientViewRecordId });

  //       vi.mocked(mockedNoteSyncHandler.getAllIds).mockReturnValue(
  //         Effect.succeed([mockNote1.id, updatedNote2.id]),
  //       );
  //       vi.mocked(mockedBlockSyncHandler.getAllIds).mockReturnValue(
  //         Effect.succeed([]),
  //       );
  //       vi.mocked(mockedNoteSyncHandler.getPatchOperations).mockReturnValue(
  //         Effect.succeed([
  //           {
  //             op: "put",
  //             key: `note/${updatedNote2.id}`,
  //             value: {
  //               _tag: "note",
  //               ...updatedNote2,
  //               created_at: updatedNote2.created_at.toISOString(),
  //               updated_at: updatedNote2.updated_at.toISOString(),
  //             },
  //           },
  //         ]),
  //       );
  //       vi.mocked(mockedBlockSyncHandler.getPatchOperations).mockReturnValue(
  //         Effect.succeed([]),
  //       );

  //       // Act
  //       const result = yield* handlePull(req).pipe(
  //         Effect.provide(MockDbLive),
  //         Effect.provide(AuthTestLive),
  //         Effect.either,
  //       );

  //       // Assert
  //       expect(Either.isRight(result)).toBe(true);
  //       if (Either.isRight(result)) {
  //         expect(result.right.cookie).toBe(2);
  //         expect(result.right.patch).toHaveLength(1);
  //         expect(result.right.patch[0]).toEqual(
  //           expect.objectContaining({
  //             op: "put",
  //             key: `note/${updatedNote2.id}`,
  //           }),
  //         );
  //       }
  //     }),
  // );

  // it.effect(
  //   "[success] when a note is deleted between pulls, it returns a del patch operation for that note",
  //   () =>
  //     Effect.gen(function* () {
  //       const { db, mockTrx } = makeMockDb();
  //       const MockDbLive = Layer.succeed(Db, Db.of(db as any));
  //       const req: PullRequest = {
  //         clientGroupID: "test_client_group",
  //         cookie: 2,
  //       };
  //       const lastPullTimestamp = new Date("2025-01-04T10:00:00Z");

  //       // Arrange Mocks
  //       vi.mocked(mockTrx.executeTakeFirst)
  //         // For fetching old CVR. Note 2 was present.
  //         .mockResolvedValueOnce({
  //           id: 2,
  //           user_id: mockUser.id,
  //           data: { notes: [mockNote1.id, mockNote2.id], blocks: [] },
  //           created_at: lastPullTimestamp,
  //         });

  //       vi.mocked(mockTrx.executeTakeFirstOrThrow)
  //         // For creating new CVR
  //         .mockResolvedValueOnce({ id: 3 as ClientViewRecordId });

  //       // In the new state, Note 2 is gone.
  //       vi.mocked(mockedNoteSyncHandler.getAllIds).mockReturnValue(
  //         Effect.succeed([mockNote1.id]),
  //       );
  //       vi.mocked(mockedBlockSyncHandler.getAllIds).mockReturnValue(
  //         Effect.succeed([]),
  //       );

  //       // The patch logic for notes should detect the deletion.
  //       vi.mocked(mockedNoteSyncHandler.getPatchOperations).mockReturnValue(
  //         Effect.succeed([{ op: "del", key: `note/${mockNote2.id}` }]),
  //       );
  //       vi.mocked(mockedBlockSyncHandler.getPatchOperations).mockReturnValue(
  //         Effect.succeed([]),
  //       );

  //       // Act
  //       const result = yield* handlePull(req).pipe(
  //         Effect.provide(MockDbLive),
  //         Effect.provide(AuthTestLive),
  //         Effect.either,
  //       );

  //       // Assert
  //       expect(Either.isRight(result)).toBe(true);
  //       if (Either.isRight(result)) {
  //         expect(result.right.cookie).toBe(3);
  //         expect(result.right.patch).toHaveLength(1);
  //         expect(result.right.patch[0]).toEqual({
  //           op: "del",
  //           key: `note/${mockNote2.id}`,
  //         });
  //       }
  //     }),
  // ); /* additional test cases remain unchanged */
});
