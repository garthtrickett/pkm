// FILE: src/features/auth/handlers/session.handler.test.ts
import { describe, it, expect, beforeEach, afterEach } from "@effect/vitest";
import { vi } from "vitest";
import { Effect, Layer, Either } from "effect";
import { Argon2id } from "oslo/password";
import { SessionRpcHandlers } from "./session.handler";
import { Db } from "../../../db/DbTag";
import type { User, UserId } from "../../../lib/shared/schemas.ts";
import { AuthError } from "../../../lib/shared/auth";
import { Crypto } from "../../../lib/server/crypto";
import { JwtService } from "../../../lib/server/JwtService";

// --- Mocks ---

const { mockGenerateToken } = vi.hoisted(() => ({
  mockGenerateToken: vi.fn(() => Effect.succeed("mock_jwt_token")),
}));

const MockJwtServiceLive = Layer.succeed(
  JwtService,
  JwtService.of({
    generateToken: mockGenerateToken,
    validateToken: vi.fn(),
  }),
);

const mockUser: User = {
  id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" as UserId,
  email: "test@example.com",
  password_hash: "hashed_password",
  email_verified: true,
  created_at: new Date(),
  avatar_url: null,
  permissions: [],
};

// Mock Db Layer
const makeMockDb = (user: User | undefined) =>
  Layer.succeed(
    Db,
    Db.of({
      selectFrom: vi.fn(() => ({
        selectAll: vi.fn(() => ({
          where: vi.fn(() => ({
            executeTakeFirst: vi.fn().mockResolvedValue(user),
          })),
        })),
      })),
    } as any),
  );

const CryptoTestLive = Layer.succeed(
  Crypto,
  Crypto.of({
    randomBytes: vi.fn(),
    generateId: vi.fn(),
    hashPassword: vi.fn(),
    verifyPassword: vi.fn(),
  } as any),
);

describe("Auth Handlers: login", () => {
  beforeEach(() => {
    vi.spyOn(Argon2id.prototype, "verify");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Test Case 1: Success
  it.effect("given correct credentials, returns user and JWT", () =>
    Effect.gen(function* () {
      vi.mocked(Argon2id.prototype.verify).mockResolvedValue(true);
      const MockDbLive = makeMockDb(mockUser);
      const runnable = SessionRpcHandlers.login({
        email: "test@example.com",
        password: "password123",
      }).pipe(
        Effect.provide(MockDbLive),
        Effect.provide(CryptoTestLive),
        Effect.provide(MockJwtServiceLive),
      );

      const result = yield* Effect.either(runnable);

      if (Either.isRight(result)) {
        const { user, token } = result.right;
        expect(user.email).toBe(mockUser.email);
        expect(token).toBe("mock_jwt_token");
        expect(user).not.toHaveProperty("password_hash");
      } else {
        throw new Error("Expected success but got failure");
      }
    }),
  );

  // Test Case 2: Incorrect Password
  it.effect("given incorrect password, fails with Unauthorized error", () =>
    Effect.gen(function* () {
      vi.mocked(Argon2id.prototype.verify).mockResolvedValue(false);
      const MockDbLive = makeMockDb(mockUser);
      const runnable = SessionRpcHandlers.login({
        email: "test@example.com",
        password: "wrong_password",
      }).pipe(
        Effect.provide(MockDbLive),
        Effect.provide(CryptoTestLive),
        Effect.provide(MockJwtServiceLive),
      );

      const result = yield* Effect.either(runnable);

      expect(Either.isLeft(result)).toBe(true);
      if (Either.isLeft(result)) {
        const error = result.left;
        expect(error).toBeInstanceOf(AuthError);
        expect(error._tag).toBe("Unauthorized");
      }
    }),
  );

  // Test Case 3: Non-existent Email
  it.effect("given non-existent email, fails with Unauthorized error", () =>
    Effect.gen(function* () {
      const MockDbLive = makeMockDb(undefined); // No user found
      const runnable = SessionRpcHandlers.login({
        email: "nouser@example.com",
        password: "password123",
      }).pipe(
        Effect.provide(MockDbLive),
        Effect.provide(CryptoTestLive),
        Effect.provide(MockJwtServiceLive),
      );

      const result = yield* Effect.either(runnable);

      expect(Either.isLeft(result)).toBe(true);
      if (Either.isLeft(result)) {
        const error = result.left;
        expect(error).toBeInstanceOf(AuthError);
        expect(error._tag).toBe("Unauthorized");
      }
    }),
  );

  // Test Case 4: Unverified User
  it.effect(
    "given credentials for an unverified user, fails with Forbidden error",
    () =>
      Effect.gen(function* () {
        vi.mocked(Argon2id.prototype.verify).mockResolvedValue(true);
        const unverifiedUser = { ...mockUser, email_verified: false };
        const MockDbLive = makeMockDb(unverifiedUser);
        const runnable = SessionRpcHandlers.login({
          email: "test@example.com",
          password: "password123",
        }).pipe(
          Effect.provide(MockDbLive),
          Effect.provide(CryptoTestLive),
          Effect.provide(MockJwtServiceLive),
        );

        const result = yield* Effect.either(runnable);

        expect(Either.isLeft(result)).toBe(true);
        if (Either.isLeft(result)) {
          const error = result.left;
          expect(error).toBeInstanceOf(AuthError);
          expect(error._tag).toBe("Forbidden");
        }
      }),
  );
});
