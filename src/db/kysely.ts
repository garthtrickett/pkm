// src/db/kysely.ts
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { Effect } from "effect";
import type { Database } from "../types";

// An Effect that creates our Kysely<DB> instance.
// It reads from process.env to decide which database to connect to.
export const makeDbLive = Effect.sync(() => {
  const connectionString =
    process.env.USE_LOCAL_NEON_PROXY === "true"
      ? process.env.DATABASE_URL_LOCAL
      : process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL or DATABASE_URL_LOCAL must be set");
  }

  const dialect = new PostgresDialect({
    pool: new Pool({ connectionString }),
  });

  return new Kysely<Database>({ dialect });
});
