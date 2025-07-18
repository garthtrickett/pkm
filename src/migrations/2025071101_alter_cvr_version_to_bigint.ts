// migrations/2025071101_alter_cvr_version_to_bigint.ts
import { Kysely } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>) {
  // Alter the column type to match the bigserial it references
  await db.schema
    .alterTable("replicache_client_group")
    .alterColumn("cvr_version", (c) => c.setDataType("bigint"))
    .execute();
}

export async function down(db: Kysely<Database>) {
  // Revert back to integer if needed
  await db.schema
    .alterTable("replicache_client_group")
    .alterColumn("cvr_version", (c) => c.setDataType("integer"))
    .execute();
}
