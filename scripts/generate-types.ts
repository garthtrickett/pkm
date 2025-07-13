// scripts/generate-types.ts
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { config } from "dotenv";
import { Effect, Cause, Exit, Data, Layer } from "effect";
import { ConfigLive } from "../src/lib/server/Config";
import { ObservabilityLive } from "../src/lib/server/observability";

config({ path: ".env" });

const execAsync = promisify(exec);

class KanelError extends Data.TaggedError("KanelError")<{
  readonly cause: unknown;
}> {}

const generateTypesEffect = Effect.gen(function* () {
  yield* Effect.logInfo("🚀 Starting Kanel type generation...");

  const command = `bunx kanel --config ./.kanelrc.cjs`;
  yield* Effect.logInfo({ command }, "Executing command");

  const { stdout, stderr } = yield* Effect.tryPromise({
    try: () => execAsync(command),
    catch: (cause) => new KanelError({ cause }),
  });

  if (stderr) {
    yield* Effect.logWarning({ stderr }, "Kanel process stderr");
  }
  if (stdout) {
    yield* Effect.logInfo({ stdout }, "Kanel process stdout");
  }

  yield* Effect.logInfo("✅ Type generation completed successfully!");
});

const programLayer = Layer.mergeAll(ConfigLive, ObservabilityLive);

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
