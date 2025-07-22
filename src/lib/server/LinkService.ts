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
        yield* Effect.logDebug(
          `[LinkService] Starting update for noteId: ${noteId}`,
        );

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
        yield* Effect.logDebug(
          `[LinkService] Found ${blocks.length} blocks for note.`,
        );

        const blockIds = blocks.map((b) => b.id);
        if (blockIds.length === 0) {
          return;
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
        yield* Effect.logDebug(
          `[LinkService] Found ${uniqueLinkTitles.size} unique link titles to resolve.`,
        );

        // --- START OF FIX: Remove nested transaction ---

        // Delete old links directly on the transaction
        yield* Effect.tryPromise({
          try: () =>
            db
              .deleteFrom("link")
              .where("source_block_id", "in", blockIds)
              .execute(),
          catch: (cause) => new LinkServiceError({ cause }),
        });
        yield* Effect.logDebug(`[LinkService] Deleted old links.`);

        if (uniqueLinkTitles.size === 0) {
          yield* Effect.logDebug(`[LinkService] No new links to add.`);
          return;
        }

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
        yield* Effect.logDebug(
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
          yield* Effect.logDebug(
            `[LinkService] Inserted ${newLinks.length} new links.`,
          );
        }

        // --- END OF FIX ---

        yield* Effect.logInfo(
          `[LinkService] Finished link update for note ${noteId}.`,
        );
      }),
  }),
);
