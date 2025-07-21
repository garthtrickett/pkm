// FILE: src/features/auth/handlers/registration.handler.verifyEmail.test.ts
import { vi } from "vitest"; // [!code ++]
import { describe, it, expect, afterEach } from "@effect/vitest"; // [!code ++]
import { Effect, Layer, Either } from "effect";
import { RegistrationRpcHandlers } from "./registration.handler";
import { Db } from "../../../db/DbTag";
import { Crypto } from "../../../lib/server/crypto";
import { AuthError } from "../../../lib/shared/auth";
import type { User, UserId } from "../../../lib/shared/schemas";
import type {
  EmailVerificationToken,
  EmailVerificationTokenId,
} from "../../../types/generated/public/EmailVerificationToken";

// --- Mocks ---
const { createSessionEffect } = vi.hoisted(() => ({
  createSessionEffect: vi.fn(() => Effect.succeed("mock_session_id")),
}));

vi.mock("../../../lib/server/session.service.ts", () => ({
  createSessionEffect,
}));

// --- Test Data ---
const mockUser: User = {
  id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" as UserId,
  email: "test@example.com",
  password_hash: "hashed_password",
  email_verified: false,
  created_at: new Date(),
  avatar_url: null,
  permissions: [],
};

const mockToken: EmailVerificationToken = {
  id: "valid_token" as EmailVerificationTokenId,
  user_id: mockUser.id,
  email: mockUser.email,
  expires_at: new Date(Date.now() + 3600 * 1000), // Expires in 1 hour
};

// --- Mock Layers ---
const makeMockDb = (
  token: EmailVerificationToken | undefined,
  user: User | undefined,
) =>
  Layer.succeed(
    Db,
    Db.of({
      deleteFrom: vi.fn(() => ({
        where: vi.fn(() => ({
          returningAll: vi.fn(() => ({
            executeTakeFirst: vi.fn().mockResolvedValue(token),
          })),
        })),
      })),
      updateTable: vi.fn(() => ({
        set: vi.fn(() => ({
          where: vi.fn(() => ({
            returningAll: vi.fn(() => ({
              executeTakeFirstOrThrow: vi.fn().mockResolvedValue(user),
            })),
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
  } as any),
);

// --- Test Suite ---
describe("Auth Handlers: verifyEmail", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it.effect(
    "[success] given a valid, unexpired token, it marks the user as verified and returns a session",
    () =>
      Effect.gen(function* () {
        const updatedUser = { ...mockUser, email_verified: true };
        const MockDbLive = makeMockDb(mockToken, updatedUser);

        const runnable = RegistrationRpcHandlers.verifyEmail({
          token: "valid_token",
        }).pipe(Effect.provide(MockDbLive), Effect.provide(CryptoTestLive));

        const result = yield* Effect.either(runnable);

        expect(Either.isRight(result)).toBe(true);
        if (Either.isRight(result)) {
          const { user, sessionId } = result.right;
          expect(user.id).toBe(mockUser.id);
          expect(user.email_verified).toBe(true);
          expect(sessionId).toBe("mock_session_id");
          expect(createSessionEffect).toHaveBeenCalledWith(mockUser.id);
        }
      }),
  );

  const failureCases = [
    {
      description: "invalid",
      tokenValue: undefined,
    },
    {
      description: "expired",
      tokenValue: {
        ...mockToken,
        expires_at: new Date(Date.now() - 3600 * 1000),
      },
    },
  ];

  failureCases.forEach(({ description, tokenValue }) => {
    it.effect(
      `[failure] given an ${description} token, fails with BadRequest error`,
      () =>
        Effect.gen(function* () {
          const MockDbLive = makeMockDb(tokenValue, undefined);

          const runnable = RegistrationRpcHandlers.verifyEmail({
            token: "any_token",
          }).pipe(Effect.provide(MockDbLive), Effect.provide(CryptoTestLive));

          const result = yield* Effect.either(runnable);

          expect(Either.isLeft(result)).toBe(true);
          if (Either.isLeft(result)) {
            const error = result.left;
            expect(error).toBeInstanceOf(AuthError);
            expect(error._tag).toBe("BadRequest");
            expect(error.message).toBe(
              "Invalid or expired verification token.",
            );
          }
        }),
    );
  });
});
