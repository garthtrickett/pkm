// migrations/2025063001_create_password_reset_token.ts
import type { Kysely } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>) {
  await db.schema
    .createTable("password_reset_token")
    .ifNotExists()
    .addColumn("id", "text", (c) => c.primaryKey())
    .addColumn("user_id", "uuid", (c) =>
      c.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("expires_at", "timestamp", (c) => c.notNull())
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropTable("password_reset_token").ifExists().execute();
}
