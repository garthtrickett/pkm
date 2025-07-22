// src/migrations/07_create_links_table.ts
import type { Kysely } from "kysely";
import type { Database } from "../types";

export async function up(db: Kysely<Database>) {
  await db.schema
    .createTable("link") // CHANGED: from "links" to "link"
    .ifNotExists()
    .addColumn("source_block_id", "uuid", (c) =>
      c.notNull().references("block.id").onDelete("cascade"),
    )
    .addColumn("target_note_id", "uuid", (c) =>
      c.notNull().references("note.id").onDelete("cascade"),
    )
    .addPrimaryKeyConstraint("link_pkey", [
      // CHANGED: from "links_pkey"
      "source_block_id",
      "target_note_id",
    ])
    .execute();

  // Add an index on target_note_id to make querying for backlinks fast
  await db.schema
    .createIndex("link_target_note_id_idx") // CHANGED: from "links_..."
    .on("link") // CHANGED: from "links"
    .column("target_note_id")
    .execute();
}

export async function down(db: Kysely<Database>) {
  await db.schema.dropIndex("link_target_note_id_idx").ifExists().execute(); // CHANGED: from "links_..."
  await db.schema.dropTable("link").ifExists().execute(); // CHANGED: from "links"
}
