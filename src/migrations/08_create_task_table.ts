// src/migrations/08_create_task_table.ts
import type { Kysely } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>) {
  await db.schema
    .createTable("task")
    .ifNotExists()
    .addColumn("id", "uuid", (c) =>
      c.primaryKey().defaultTo(db.fn("gen_random_uuid")),
    )
    .addColumn("user_id", "uuid", (c) =>
      c.notNull().references("user.id").onDelete("cascade"),
    )
    // A block can only be associated with one task, so this should be unique.
    .addColumn("source_block_id", "uuid", (c) =>
      c.notNull().references("block.id").onDelete("cascade").unique(),
    )
    .addColumn("content", "text", (c) => c.notNull())
    .addColumn("is_complete", "boolean", (c) => c.notNull().defaultTo(false))
    .addColumn("due_date", "timestamp") // Nullable
    .addColumn("project", "text") // Nullable
    .addColumn("created_at", "timestamp", (c) =>
      c.notNull().defaultTo(db.fn("now")),
    )
    .addColumn("updated_at", "timestamp", (c) =>
      c.notNull().defaultTo(db.fn("now")),
    )
    .execute();

  // Add indexes for common query patterns
  await db.schema
    .createIndex("task_user_id_idx")
    .on("task")
    .column("user_id")
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropIndex("task_user_id_idx").ifExists().execute();
  await db.schema.dropTable("task").ifExists().execute();
}
