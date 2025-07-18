// src/migrations/05_create_replicache_tables.ts
import { Kysely } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>) {
  // Manages sync versions for groups of clients
  await db.schema
    .createTable("replicache_client_group")
    .ifNotExists()
    .addColumn("id", "text", (c) => c.primaryKey())
    .addColumn("user_id", "uuid", (c) => c.notNull())
    .addColumn("cvr_version", "integer", (c) => c.notNull().defaultTo(0))
    .addColumn("updated_at", "timestamp", (c) =>
      c.notNull().defaultTo(db.fn("now")),
    )
    .execute();

  // Stores individual client state
  await db.schema
    .createTable("replicache_client")
    .ifNotExists()
    .addColumn("id", "text", (c) => c.primaryKey())
    .addColumn("client_group_id", "text", (c) =>
      c.notNull().references("replicache_client_group.id").onDelete("cascade"),
    )
    .addColumn("last_mutation_id", "integer", (c) => c.notNull().defaultTo(0))
    .addColumn("updated_at", "timestamp", (c) =>
      c.notNull().defaultTo(db.fn("now")),
    )
    .execute();

  // Stores the client's view of the data at a specific version
  await db.schema
    .createTable("client_view_record")
    .ifNotExists()
    .addColumn("id", "serial", (c) => c.primaryKey()) // Use 32-bit serial
    .addColumn("user_id", "uuid", (c) =>
      c.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("data", "jsonb", (c) => c.notNull())
    .addColumn("created_at", "timestamp", (c) =>
      c.notNull().defaultTo(db.fn("now")),
    )
    .execute();

  // Stores individual mutations
  await db.schema
    .createTable("change_log")
    .ifNotExists()
    .addColumn("id", "bigserial", (c) => c.primaryKey())
    .addColumn("client_group_id", "text", (c) =>
      c.notNull().references("replicache_client_group.id").onDelete("cascade"),
    )
    .addColumn("client_id", "text", (c) =>
      c.notNull().references("replicache_client.id").onDelete("cascade"),
    )
    .addColumn("mutation_id", "integer", (c) => c.notNull())
    .addColumn("name", "text", (c) => c.notNull())
    .addColumn("args", "jsonb", (c) => c.notNull())
    .addColumn("created_at", "timestamp", (c) =>
      c.notNull().defaultTo(db.fn("now")),
    )
    .execute();

  // Add index for change_log
  await db.schema
    .createIndex("change_log_client_group_id_id_idx")
    .on("change_log")
    .columns(["client_group_id", "id"])
    .execute();

  // Add index for client_view_record
  await db.schema
    .createIndex("cvr_user_id_created_at_idx")
    .on("client_view_record")
    .columns(["user_id", "created_at"])
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropTable("change_log").ifExists().execute();
  await db.schema.dropTable("client_view_record").ifExists().execute();
  await db.schema.dropTable("replicache_client").ifExists().execute();
  await db.schema.dropTable("replicache_client_group").ifExists().execute();
}
