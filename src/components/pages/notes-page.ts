// src/components/pages/notes-page.ts
import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit-html/directives/repeat.js";
import { Effect, Schema } from "effect";
import { runClientUnscoped, runClientPromise } from "../../lib/client/runtime";
import {
  ReplicacheService,
  type ReplicacheMutators,
} from "../../lib/client/replicache";
import { authState } from "../../lib/client/stores/authStore";
import { navigate } from "../../lib/client/router";
import { NotionButton } from "../ui/notion-button";
import styles from "./NotesView.module.css";
import { NoteSchema, type Note, type NoteId } from "../../lib/shared/schemas";
import { clientLog } from "../../lib/client/clientLog";
import { Replicache } from "replicache";
import { v4 as uuidv4 } from "uuid"; // Import uuid

@customElement("notes-page")
export class NotesPage extends LitElement {
  // ... (state and properties are the same)
  @state()
  private _notes: Note[] = [];
  @state()
  private _isCreating = false;

  private _rep: Replicache<ReplicacheMutators> | undefined;
  private _unsubscribe: (() => void) | undefined;

  // ... (the _connectedEffect is correct and remains the same)
  private readonly _connectedEffect = Effect.gen(
    function* (this: NotesPage) {
      yield* clientLog(
        "info",
        "[NotesPage] Component connected, initializing.",
      );
      const replicache = yield* ReplicacheService;
      this._rep = replicache.client;
      this._unsubscribe = this._rep.subscribe(
        async (tx) => {
          const noteJSONs = await tx
            .scan({ prefix: "note/" })
            .values()
            .toArray();
          const notes = noteJSONs.flatMap((json) => {
            try {
              return [Schema.decodeUnknownSync(NoteSchema)(json)];
            } catch (e) {
              runClientUnscoped(
                clientLog(
                  "warn",
                  "[NotesPage] Failed to decode note from Replicache, filtering out.",
                  { error: e },
                ),
              );
              return [];
            }
          });
          return notes;
        },
        (notes: Note[]) => {
          this._notes = notes.sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime(),
          );
          runClientUnscoped(
            clientLog("debug", "[NotesPage] Notes state updated.", {
              noteCount: this._notes.length,
            }),
          );
        },
      );
    }.bind(this),
  );

  // ... (connectedCallback and disconnectedCallback are the same)
  override connectedCallback() {
    super.connectedCallback();
    if (authState.value.status === "authenticated") {
      void runClientPromise(this._connectedEffect);
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._unsubscribe?.();
    runClientUnscoped(
      clientLog(
        "info",
        "[NotesPage] Component disconnected, unsubscribed from Replicache.",
      ),
    );
  }

  private _createNewNote() {
    this._isCreating = true;

    // ✅ FIX 1: Bind `this` to the generator function.
    const createEffect = Effect.gen(
      function* (this: NotesPage) {
        if (!this._rep) {
          return yield* Effect.logError(
            "[NotesPage] Replicache client not available for mutation.",
          );
        }

        const user = authState.value.user;
        if (!user) {
          return yield* Effect.logError(
            "[NotesPage] Cannot create note without authenticated user.",
          );
        }

        const newNoteId = uuidv4() as NoteId;

        yield* clientLog("info", "[NotesPage] Creating new note...", {
          userId: user.id,
          newNoteId: newNoteId,
        });

        const newNoteJSON = yield* Effect.promise(() =>
          this._rep!.mutate.createNote({
            id: newNoteId,
            userID: user.id,
            title: "Untitled Note",
          }),
        );

        const newNote = yield* Schema.decodeUnknown(NoteSchema)(newNoteJSON);

        this._isCreating = false;

        return yield* navigate(`/notes/${newNote.id}`);
      }.bind(this),
    ); // <-- Bind `this` here

    // ✅ FIX 2: Pipe the error handling to the created effect.
    const finalEffect = createEffect.pipe(
      Effect.catchAll((err) => {
        this._isCreating = false;
        return clientLog("error", "[NotesPage] Failed to create note", err);
      }),
    );

    // Run the final, composed effect.
    void runClientPromise(finalEffect);
  }

  override render() {
    return html`
      <div class=${styles.container}>
        <div class=${styles.header}>
          <div>
            <h2 class=${styles.headerH2}>Your Notes</h2>
            <p class=${styles.headerP}>
              Create, view, and edit your notes below.
            </p>
          </div>
          <div class=${styles.actions}>
            ${NotionButton({
              children: this._isCreating ? "Creating..." : "Create New Note",
              onClick: () => this._createNewNote(),
              loading: this._isCreating,
            })}
          </div>
        </div>
        <div class=${styles.notesList}>
          ${this._notes.length > 0
            ? repeat(
                this._notes,
                (note) => note.id,
                (note) => html`
                  <a
                    href="/notes/${note.id}"
                    class=${styles.noteItem}
                    @click=${(e: Event) => {
                      e.preventDefault();
                      runClientUnscoped(navigate(`/notes/${note.id}`));
                    }}
                  >
                    <h3 class=${styles.noteItemH3}>${note.title}</h3>
                    <p class=${styles.noteItemP}>
                      ${note.content
                        ? note.content.substring(0, 100) +
                          (note.content.length > 100 ? "..." : "")
                        : "No additional content"}
                    </p>
                  </a>
                `,
              )
            : html`
                <div class=${styles.emptyState}>
                  <h3 class=${styles.emptyStateH3}>No notes yet</h3>
                  <p class=${styles.emptyStateP}>
                    Click "Create New Note" to get started.
                  </p>
                </div>
              `}
        </div>
      </div>
    `;
  }
}
