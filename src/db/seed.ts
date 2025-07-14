// src/db/seed.ts

import { perms } from "../lib/shared/permissions";
import type { UserId } from "../types/generated/public/User";
import { Argon2id } from "oslo/password";
import { Effect, Cause, Exit, pipe, Layer, Data } from "effect";
import { DbLayer } from "../db/DbLayer";
import { Db } from "../db/DbTag";
import { ObservabilityLive } from "../lib/server/observability";

// Define a custom error for better context
class SeedingError extends Data.TaggedError("SeedingError")<{
  readonly cause: unknown;
}> {}

class PasswordHashingError extends Data.TaggedError("PasswordHashingError")<{
  readonly cause: unknown;
}> {}

const TEST_USER_PASSWORD = "password123";

const seedProgram = Effect.gen(function* () {
  yield* Effect.logInfo(
    { email: "garthtrickett@gmail.com" },
    "Seeding database with test user...",
  );

  const argon2id = new Argon2id();
  const hashedPassword = yield* Effect.tryPromise({
    try: () => argon2id.hash(TEST_USER_PASSWORD),
    catch: (cause) => new PasswordHashingError({ cause }),
  });

  const TEST_USER = {
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11" as UserId,
    email: "garthtrickett@gmail.com",
    password_hash: hashedPassword,
    permissions: [perms.note.read, perms.note.write],
    email_verified: true,
  };

  const db = yield* Db;

  // ✅ FIX: Adapt the query to use the standard Kysely API.
  // We now call `.execute()` which returns a promise, and wrap that
  // promise in an Effect to integrate it into our program.
  yield* Effect.tryPromise({
    try: () =>
      db
        .insertInto("user")
        .values(TEST_USER)
        .onConflict((oc) =>
          oc.column("id").doUpdateSet({
            email: TEST_USER.email,
            password_hash: hashedPassword,
            permissions: TEST_USER.permissions,
            email_verified: TEST_USER.email_verified,
          }),
        )
        .returning("id")
        .execute(), // <-- This is the key change
    catch: (cause) => new SeedingError({ cause }),
  }).pipe(
    Effect.tap(() =>
      Effect.logInfo(
        { email: TEST_USER.email },
        "✅ User seeded/updated successfully.",
      ),
    ),
  );
});

const programLayer = Layer.mergeAll(DbLayer, ObservabilityLive);

const runnable = pipe(
  seedProgram,
  Effect.tapError((error) => Effect.logError(`Seeding failed`, error)),
  Effect.provide(programLayer),
);

void Effect.runPromiseExit(runnable).then((exit) => {
  if (Exit.isSuccess(exit)) {
    process.exit(0);
  } else {
    // The error is already logged by the `tapError` above,
    // but we can still pretty-print the cause for clarity during development.
    console.error("\n❌ Seeding script failed. Details below:\n");
    console.error(Cause.pretty(exit.cause));
    process.exit(1);
  }
});
