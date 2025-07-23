// FILE: src/lib/server/LinkService.ts
import { Context, Data, Effect, Layer } from "effect";
import { Db } from "../../db/DbTag";
import type { UserId } from "../../types/generated/public/User";
import type { NoteId } from "../shared/schemas";
import type { NewLink } from "../../types/generated/public/Link";

const WIKI_LINK_REGEX = /\[\[([^\]]+)\]\]/g;

class LinkServiceError extends Data.TaggedError("LinkServiceError")<{
  readonly cause: unknown;
}> {}

export interface ILinkService {
  readonly updateLinksForNote: (
    noteId: NoteId,
    userId: UserId,
  ) => Effect.Effect<void, LinkServiceError, Db>;
}

export class LinkService extends Context.Tag("LinkService")<
  LinkService,
  ILinkService
>() {}

export const LinkServiceLive = Layer.succeed(
  LinkService,
  LinkService.of({
    updateLinksForNote: (noteId, userId) =>
      Effect.gen(function* () {
        const db = yield* Db; // This 'db' is already a transaction
        yield* Effect.logInfo(
          `[LinkService] Starting update for noteId: ${noteId}`,
        );

        // 1. Delete all existing links originating from this note.
        // This is robust and handles cases where blocks are removed.
        yield* Effect.tryPromise({
          try: () =>
            db
              .deleteFrom("link")
              .where("source_block_id", "in", (eb) =>
                eb
                  .selectFrom("block")
                  .select("block.id") // Be explicit
                  .where("note_id", "=", noteId),
              )
              .execute(),
          catch: (cause) => new LinkServiceError({ cause }),
        });
        yield* Effect.logInfo(`[LinkService] Cleared old links for note.`);

        // 2. Fetch current blocks to parse for new links.
        const blocks = yield* Effect.tryPromise({
          try: () =>
            db
              .selectFrom("block")
              .select(["id", "content"])
              .where("note_id", "=", noteId)
              .where("user_id", "=", userId)
              .execute(),
          catch: (cause) => new LinkServiceError({ cause }),
        });
        yield* Effect.logInfo(
          `[LinkService] Found ${blocks.length} blocks to parse for new links.`,
        );

        if (blocks.length === 0) {
          return; // No blocks, so no new links to create.
        }

        const uniqueLinkTitles = new Set<string>();
        for (const block of blocks) {
          const matches = [...block.content.matchAll(WIKI_LINK_REGEX)];
          for (const match of matches) {
            if (match[1]) {
              uniqueLinkTitles.add(match[1]);
            }
          }
        }

        if (uniqueLinkTitles.size === 0) {
          yield* Effect.logInfo(`[LinkService] No new links to add.`);
          return;
        }

        yield* Effect.logInfo(
          `[LinkService] Found ${uniqueLinkTitles.size} unique link titles to resolve.`,
        );

        const resolvedNotes = yield* Effect.tryPromise({
          try: () =>
            db
              .selectFrom("note")
              .select(["id", "title"])
              .where("title", "in", Array.from(uniqueLinkTitles))
              .where("user_id", "=", userId)
              .execute(),
          catch: (cause) => new LinkServiceError({ cause }),
        });
        yield* Effect.logInfo(
          `[LinkService] Resolved ${resolvedNotes.length} notes from titles.`,
        );

        const titleToIdMap = new Map(resolvedNotes.map((n) => [n.title, n.id]));
        const newLinks: NewLink[] = [];
        for (const block of blocks) {
          const matches = [...block.content.matchAll(WIKI_LINK_REGEX)];
          for (const match of matches) {
            if (match[1]) {
              const targetNoteId = titleToIdMap.get(match[1]);
              if (targetNoteId) {
                newLinks.push({
                  source_block_id: block.id,
                  target_note_id: targetNoteId,
                });
              }
            }
          }
        }

        if (newLinks.length > 0) {
          yield* Effect.tryPromise({
            try: () => db.insertInto("link").values(newLinks).execute(),
            catch: (cause) => new LinkServiceError({ cause }),
          });
          yield* Effect.logInfo(
            `[LinkService] Inserted ${newLinks.length} new links.`,
          );
        }

        yield* Effect.logInfo(
          `[LinkService] Finished link update for note ${noteId}.`,
        );
      }),
  }),
);
