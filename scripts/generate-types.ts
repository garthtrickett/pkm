// scripts/generate-types.ts
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { config } from "dotenv";
import { Effect, Cause, Exit, Data, Layer } from "effect";
import { serverLog, LoggerLive } from "../src/lib/server/logger.server";
import { ConfigLive } from "../src/lib/server/Config";

config({ path: ".env" });

const execAsync = promisify(exec);

class KanelError extends Data.TaggedError("KanelError")<{
  readonly cause: unknown;
}> {}

const generateTypesEffect = Effect.gen(function* () {
  yield* serverLog("info", {}, "🚀 Starting Kanel type generation...");

  const command = `bunx kanel --config ./.kanelrc.cjs`;
  yield* serverLog("info", { command }, "Executing command");

  const { stdout, stderr } = yield* Effect.tryPromise({
    try: () => execAsync(command),
    catch: (cause) => new KanelError({ cause }),
  });

  if (stderr) {
    yield* serverLog("warn", { stderr }, "Kanel process stderr");
  }
  if (stdout) {
    yield* serverLog("info", { stdout }, "Kanel process stdout");
  }

  yield* serverLog("info", {}, "✅ Type generation completed successfully!");
});

// Create a combined layer of all services the script needs.
const programLayer = Layer.mergeAll(ConfigLive, LoggerLive);

// Create the final runnable by providing the layer to the logic.
const runnable = Effect.provide(generateTypesEffect, programLayer);

void Effect.runPromiseExit(runnable).then((exit) => {
  if (Exit.isSuccess(exit)) {
    process.exit(0);
  } else {
    console.error("❌ Type generation via Kanel failed:");
    console.error(Cause.pretty(exit.cause));
    process.exit(1);
  }
});
