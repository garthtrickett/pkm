// FILE: src/features/auth/handlers/password.handler.changePassword.test.ts
import { vi } from "vitest";
import { describe, it, expect, afterEach, beforeEach } from "@effect/vitest";
import { Effect, Layer, Either } from "effect";
import { Argon2id } from "oslo/password";
import { PasswordRpcHandlers } from "./password.handler";
import { Db } from "../../../db/DbTag";
import { Auth, AuthError } from "../../../lib/shared/auth";
import type { User, UserId } from "../../../lib/shared/schemas";
import type {
  Session,
  SessionId,
} from "../../../types/generated/public/Session";

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

// --- Mock Layers ---
const makeMockDb = (user: User) => {
  const execute = vi.fn().mockResolvedValue(undefined);
  const db = {
    selectFrom: vi.fn(() => ({
      selectAll: vi.fn(() => ({
        where: vi.fn(() => ({
          executeTakeFirstOrThrow: vi.fn().mockResolvedValue(user),
        })),
      })),
    })),
    updateTable: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({
          execute,
        })),
      })),
    })),
  };
  return { db, execute };
};

const AuthTestLive = Layer.succeed(
  Auth,
  Auth.of({ user: mockUser, session: mockSession }),
);

// --- Test Suite ---
describe("Auth Handlers: changePassword", () => {
  beforeEach(() => {
    vi.spyOn(Argon2id.prototype, "verify");
    vi.spyOn(Argon2id.prototype, "hash").mockResolvedValue(
      "new_hashed_password",
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.effect(
    "[success] given the correct old password and a new password, it updates the password hash",
    () =>
      Effect.gen(function* () {
        vi.mocked(Argon2id.prototype.verify).mockResolvedValue(true);
        const { db, execute } = makeMockDb(mockUser);
        const MockDbLive = Layer.succeed(Db, Db.of(db as any));

        const runnable = PasswordRpcHandlers.changePassword({
          oldPassword: "old_password_correct",
          newPassword: "new_password_strong",
        }).pipe(Effect.provide(MockDbLive), Effect.provide(AuthTestLive));

        const result = yield* Effect.either(runnable);

        expect(Either.isRight(result)).toBe(true);
        expect(Argon2id.prototype.verify).toHaveBeenCalledWith(
          "hashed_password",
          "old_password_correct",
        );
        expect(Argon2id.prototype.hash).toHaveBeenCalledWith(
          "new_password_strong",
        );
        expect(execute).toHaveBeenCalled();
      }),
  );

  it.effect(
    "[failure] given an incorrect old password, fails with Unauthorized error",
    () =>
      Effect.gen(function* () {
        vi.mocked(Argon2id.prototype.verify).mockResolvedValue(false);
        const { db } = makeMockDb(mockUser);
        const MockDbLive = Layer.succeed(Db, Db.of(db as any));

        const runnable = PasswordRpcHandlers.changePassword({
          oldPassword: "old_password_incorrect",
          newPassword: "new_password_strong",
        }).pipe(Effect.provide(MockDbLive), Effect.provide(AuthTestLive));

        const result = yield* Effect.either(runnable);

        expect(Either.isLeft(result)).toBe(true);
        if (Either.isLeft(result)) {
          const error = result.left;
          expect(error).toBeInstanceOf(AuthError);
          expect(error._tag).toBe("Unauthorized");
          expect(error.message).toBe("Incorrect old password.");
        }
      }),
  );
});
