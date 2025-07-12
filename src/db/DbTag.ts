// src/db/DbTag.ts
import { Context } from "effect";
import type { Kysely } from "kysely";
import type { Database } from "../types";

// Service Tag for the Kysely instance
export class Db extends Context.Tag("Db")<Db, Kysely<Database>>() {}
