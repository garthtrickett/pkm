// src/migrations/02_create_note_and_tags.ts
import type { Kysely } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>) {
  // Note Table
  await db.schema
    .createTable("note")
    .ifNotExists()
    .addColumn("id", "uuid", (c) =>
      c.primaryKey().defaultTo(db.fn("gen_random_uuid")),
    )
    .addColumn("user_id", "uuid", (c) =>
      c.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("title", "text", (c) => c.notNull())
    .addColumn("content", "jsonb", (c) => c.notNull()) // [!code focus]
    .addColumn("version", "integer", (c) => c.notNull().defaultTo(1))
    .addColumn("created_at", "timestamp", (c) =>
      c.notNull().defaultTo(db.fn("now")),
    )
    .addColumn("updated_at", "timestamp", (c) =>
      c.notNull().defaultTo(db.fn("now")),
    )
    .execute();
  // Tag Table
  await db.schema
    .createTable("tag")
    .ifNotExists()
    .addColumn("id", "uuid", (c) =>
      c.primaryKey().defaultTo(db.fn("gen_random_uuid")),
    )
    .addColumn("user_id", "uuid", (c) =>
      c.notNull().references("user.id").onDelete("cascade"),
    )
    .addColumn("name", "text", (c) => c.notNull())
    .addColumn("created_at", "timestamp", (c) =>
      c.notNull().defaultTo(db.fn("now")),
    )
    .execute();

  // NoteTag Join Table
  await db.schema
    .createTable("note_tag")
    .ifNotExists()
    .addColumn("note_id", "uuid", (c) =>
      c.notNull().references("note.id").onDelete("cascade"),
    )
    .addColumn("tag_id", "uuid", (c) =>
      c.notNull().references("tag.id").onDelete("cascade"),
    )
    .addPrimaryKeyConstraint("note_tag_pkey", ["note_id", "tag_id"])
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropTable("note_tag").ifExists().execute();
  await db.schema.dropTable("tag").ifExists().execute();
  await db.schema.dropTable("note").ifExists().execute();
}
