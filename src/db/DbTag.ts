// src/db/DbTag.ts
import { Context } from "effect";
// Import EffectKysely from the PostgreSQL adapter
import type { EffectKysely } from "@effect/sql-kysely/Pg"; 
import type { Database } from "../types";

// Service Tag for the Kysely instance, now using the Effect-compatible type
export class Db extends Context.Tag("Db")<Db, EffectKysely<Database>>() {}
