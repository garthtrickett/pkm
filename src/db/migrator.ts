// src/db/migrator.ts
import { Cause, Data, Effect, Exit, Layer } from "effect";
import type { Kysely } from "kysely";
import { Migrator } from "kysely";
import { LoggerLive, serverLog } from "../lib/server/logger.server";
import type { Database } from "../types";
import { makeDbLive } from "./kysely";
import { CentralMigrationProviderLive } from "./migrations/CentralMigrationProvider";
import { CentralMigrationProvider } from "./migrations/MigrationProviderTag";

// A tagged error for migration failures to improve error handling.
class MigrationError extends Data.TaggedError("MigrationError")<{
  readonly cause: unknown;
}> {}

const runMigrations = (direction: "up" | "down", db: Kysely<Database>) =>
  Effect.gen(function* () {
    const providerService = yield* CentralMigrationProvider;

    yield* serverLog(
      "info",
      { direction },
      "Running migrations via migrator.ts",
    );

    const migrator = new Migrator({
      db,
      // Adapt the Effect-based provider to the Promise-based one Kysely expects
      provider: {
        getMigrations: () => Effect.runPromise(providerService.getMigrations),
      },
    });

    const { error, results } = yield* Effect.tryPromise({
      try: () =>
        direction === "up"
          ? migrator.migrateToLatest()
          : migrator.migrateDown(),
      catch: (cause) => new MigrationError({ cause }),
    });

    for (const it of results ?? []) {
      yield* serverLog(
        it.status === "Success" ? "info" : "error",
        { migrationName: it.migrationName, status: it.status },
        "Migration status",
      );
    }

    if (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : JSON.stringify(error, null, 2);
      yield* serverLog("error", { error: errorMessage }, "Migration failed");
      return yield* Effect.fail(error);
    }
  });

const getDirection = () => {
  const directionArg = Bun.argv[2];
  if (directionArg !== "up" && directionArg !== "down") {
    console.warn("No direction specified (or invalid). Defaulting to 'up'.");
    return "up";
  }
  return directionArg;
};

const direction = getDirection();

// This is the core logic of our script.
const programLogic = Effect.gen(function* () {
  const db = yield* makeDbLive;
  // Ensure the database connection is destroyed after migrations run.
  yield* Effect.ensuring(
    runMigrations(direction, db),
    Effect.promise(() => db.destroy()),
  );
});

// **FIX:** Merge the CentralMigrationProviderLive and LoggerLive layers.
const programLayer = Layer.merge(CentralMigrationProviderLive, LoggerLive);

// Create the final runnable effect by providing the combined layer to the logic.
const runnable = programLogic.pipe(Effect.provide(programLayer));

// Execute the fully-provided effect.
void Effect.runPromiseExit(runnable).then((exit) => {
  if (Exit.isFailure(exit)) {
    console.error(`❌ Migration via migrator.ts failed ('${direction}'):`);
    console.error(Cause.pretty(exit.cause));
    process.exit(1);
  } else {
    console.info(
      `✅ Migrations via migrator.ts completed successfully ('${direction}').`,
    );
    process.exit(0);
  }
});
