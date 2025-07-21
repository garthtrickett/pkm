// FILE: ./src/features/auth/handlers/registration.handler.test.ts
import { describe, it, expect, afterEach, beforeEach } from "@effect/vitest"; // [!code ++]
import { vi } from "vitest";
// ✅ FIX: Import vi directly from "vitest"
import { Effect, Layer, Either } from "effect";
import { Argon2id } from "oslo/password";
import { RegistrationRpcHandlers } from "./registration.handler";
import { Db } from "../../../db/DbTag";
import { Crypto } from "../../../lib/server/crypto";
import { AuthError } from "../../../lib/shared/auth";
import type { User, UserId } from "../../../lib/shared/schemas";
// --- Mocks ---

// This structure is now correct because `vi` is imported properly.
const { createVerificationToken, sendVerificationEmail } = vi.hoisted(() => {
  return {
    createVerificationToken: vi.fn(() => Effect.succeed("mock_token")),
    sendVerificationEmail: vi.fn(() => Effect.void),
  };
});
vi.mock("../auth.service.ts", () => ({
  createVerificationToken,
  sendVerificationEmail,
}));

const mockNewUser: User = {
  id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" as UserId,
  email: "new@example.com",
  password_hash: "hashed_password",
  email_verified: false,
  created_at: new Date(),
  avatar_url: null,
  permissions: [],
};
// Mock Crypto Layer
const CryptoTestLive = Layer.succeed(
  Crypto,
  Crypto.of({
    randomBytes: vi.fn(),
    generateId: vi.fn(),
  } as any),
);
describe("Auth Handlers: signup", () => {
  // ✅ FIX: Spy on the Argon2id prototype before each test
  beforeEach(() => {
    // [!code ++]
    vi.spyOn(Argon2id.prototype, "hash").mockResolvedValue("hashed_password"); // [!code ++]
  }); // [!code ++]
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks(); // [!code ++]
  });

  // Test Case 1: Success
  it.effect(
    "given a new email/password, it hashes the password and creates a user",
    () =>
      Effect.gen(function* () {
        const mockDb = {
          selectFrom: vi.fn(() => ({
            select: vi.fn(() => ({
              where: vi.fn(() => ({
                executeTakeFirst: vi.fn().mockResolvedValue(undefined), // No existing user
              })),
            })),
          })),
          insertInto: vi.fn(() => ({
            values: vi.fn(() => ({
              returningAll: vi.fn(() => ({
                executeTakeFirstOrThrow: vi.fn().mockResolvedValue(mockNewUser),
              })),
            })),
          })),
        };
        const MockDbLive = Layer.succeed(Db, Db.of(mockDb as any));

        const runnable = RegistrationRpcHandlers.signup({
          email: "new@example.com",
          password: "password123",
        }).pipe(Effect.provide(MockDbLive), Effect.provide(CryptoTestLive));
        const result = yield* Effect.either(runnable);

        expect(Either.isRight(result)).toBe(true);
        if (Either.isRight(result)) {
          const user = result.right;
          expect(user.email).toBe(mockNewUser.email);
          expect(user).not.toHaveProperty("password_hash");
          expect(mockDb.insertInto).toHaveBeenCalledWith("user");
          expect(new Argon2id().hash).toHaveBeenCalledWith("password123");
          expect(vi.mocked(createVerificationToken)).toHaveBeenCalledWith(
            mockNewUser.id,
            mockNewUser.email,
          );
          expect(vi.mocked(sendVerificationEmail)).toHaveBeenCalledWith(
            mockNewUser.email,
            "mock_token",
          );
        }
      }),
  );

  // Test Case 2: Email Already Exists
  it.effect(
    "given an email that already exists, fails with EmailAlreadyExistsError",
    () =>
      Effect.gen(function* () {
        const mockDb = {
          selectFrom: vi.fn(() => ({
            select: vi.fn(() => ({
              where: vi.fn(() => ({
                executeTakeFirst: vi.fn().mockResolvedValue({ id: "some-id" }), // User exists
              })),
            })),
          })),
        };
        const MockDbLive = Layer.succeed(Db, Db.of(mockDb as any));

        const runnable = RegistrationRpcHandlers.signup({
          email: "existing@example.com",
          password: "password123",
        }).pipe(Effect.provide(MockDbLive), Effect.provide(CryptoTestLive));

        const result = yield* Effect.either(runnable);

        expect(Either.isLeft(result)).toBe(true);
        if (Either.isLeft(result)) {
          const error = result.left;
          expect(error).toBeInstanceOf(AuthError);
          expect(error._tag).toBe("EmailAlreadyExistsError");
        }
      }),
  );
});
