// src/migrations/03_create_auth_tables.ts
import type { Kysely } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>) {
  // Session Table
  await db.schema
    .createTable("session")
    .ifNotExists()
    .addColumn("id", "text", (c) => c.primaryKey())
    .addColumn("user_id", "uuid", (c) =>
      c.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("expires_at", "timestamp", (c) => c.notNull())
    .execute();

  // Password Reset Token Table
  await db.schema
    .createTable("password_reset_token")
    .ifNotExists()
    .addColumn("id", "text", (c) => c.primaryKey())
    .addColumn("user_id", "uuid", (c) =>
      c.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("expires_at", "timestamp", (c) => c.notNull())
    .execute();

  // Email Verification Token Table
  await db.schema
    .createTable("email_verification_token")
    .ifNotExists()
    .addColumn("id", "text", (c) => c.primaryKey())
    .addColumn("user_id", "uuid", (c) =>
      c.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("email", "text", (c) => c.notNull())
    .addColumn("expires_at", "timestamp", (c) => c.notNull())
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropTable("email_verification_token").ifExists().execute();
  await db.schema.dropTable("password_reset_token").ifExists().execute();
  await db.schema.dropTable("session").ifExists().execute();
}
