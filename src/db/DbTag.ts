// src/db/DbTag.ts
import { Context } from "effect";
// --- FIX: Import the standard Kysely type ---
import type { Kysely } from "kysely";
import type { Database } from "../types";

// --- FIX: Change the service type from EffectKysely to Kysely ---
// This tells the rest of the application to expect a standard,
// promise-based Kysely instance.
export class Db extends Context.Tag("Db")<Db, Kysely<Database>>() {}
