import * as Pg from "@effect/sql-pg";
import * as PgKysely from "@effect/sql-kysely/Pg";
import { Layer, Effect, pipe } from "effect";
import type { Database } from "../types";
import { Config as ConfigService, ConfigLive } from "../lib/server/Config";
import { Db } from "./DbTag";

export const DbLayer = Layer.effect(Db, PgKysely.make<Database>()).pipe(
  Layer.provide(
    Layer.unwrapEffect(
      pipe(
        ConfigService,
        Effect.map((c) =>
          Pg.PgClient.layer({
            // ✅ just forward the value; no need to unwrap
            url: c.neon.connectionString,
          }),
        ),
      ),
    ),
  ),
  Layer.provide(ConfigLive),
);
