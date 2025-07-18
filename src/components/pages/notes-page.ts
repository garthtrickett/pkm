// FILE: ./src/components/pages/notes-page.ts
import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit-html/directives/repeat.js";
import { Effect, Schema } from "effect";
import { runClientUnscoped, runClientPromise } from "../../lib/client/runtime";
import { ReplicacheService } from "../../lib/client/replicache";
import { authState, type AuthModel } from "../../lib/client/stores/authStore";
import { navigate } from "../../lib/client/router";
import { NotionButton } from "../ui/notion-button";
import styles from "./NotesView.module.css";
import { NoteSchema, type Note, type NoteId } from "../../lib/shared/schemas";
import { clientLog } from "../../lib/client/clientLog";
import { v4 as uuidv4 } from "uuid";

@customElement("notes-page")
export class NotesPage extends LitElement {
  @state() private _notes: Note[] = [];
  @state() private _isCreating = false;
  // ✅ FIX: Add a flag to prevent re-initialization.
  @state() private _isInitialized = false;

  private _replicacheUnsubscribe: (() => void) | undefined;
  // ✅ FIX: Add a dedicated unsubscribe for the auth state.
  private _authUnsubscribe: (() => void) | undefined;

  private readonly _connectedEffect = Effect.gen(
    function* (this: NotesPage) {
      yield* clientLog(
        "info",
        "[NotesPage] Component connected, initializing.",
      );
      const replicache = yield* ReplicacheService;
      this._replicacheUnsubscribe = replicache.client.subscribe(
        async (tx) => {
          const noteJSONs = await tx
            .scan({ prefix: "note/" })
            .values()
            .toArray();
          return noteJSONs.flatMap((json) =>
            Schema.decodeUnknownOption(NoteSchema)(json).pipe((o) =>
              o._tag === "Some" ? [o.value] : [],
            ),
          );
        },
        (notes: Note[]) => {
          this._notes = notes.sort(
            (a, b) =>
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime(),
          );
        },
      );
    }.bind(this),
  );

  // ✅ FIX: Replace the racy connectedCallback with a robust subscription.
  override connectedCallback() {
    super.connectedCallback();

    const handleAuthChange = (auth: AuthModel) => {
      // Only initialize if we are authenticated and haven't already.
      if (auth.status === "authenticated" && !this._isInitialized) {
        this._isInitialized = true;
        void runClientPromise(this._connectedEffect);
      }
      // If the user logs out, reset the component's state.
      else if (auth.status !== "authenticated" && this._isInitialized) {
        this._isInitialized = false;
        this._replicacheUnsubscribe?.();
        this._notes = [];
      }
    };

    // Subscribe to the auth state and immediately run the handler.
    this._authUnsubscribe = authState.subscribe(handleAuthChange);
    handleAuthChange(authState.value);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._replicacheUnsubscribe?.();
    // ✅ FIX: Unsubscribe from the auth store on disconnect.
    this._authUnsubscribe?.();
    runClientUnscoped(clientLog("info", "[NotesPage] Component disconnected."));
  }

  private _deleteNote(noteId: NoteId) {
    const deleteEffect = Effect.gen(function* () {
      const replicache = yield* ReplicacheService;
      yield* Effect.promise(() =>
        replicache.client.mutate.deleteNote({ id: noteId }),
      );
    });
    void runClientPromise(deleteEffect);
  }

  private _createNewNote() {
    this._isCreating = true;
    const createEffect = Effect.gen(function* () {
      const replicache = yield* ReplicacheService;
      const user = authState.value.user!;
      const newNoteId = uuidv4() as NoteId;
      yield* Effect.promise(() =>
        replicache.client.mutate.createNote({
          id: newNoteId,
          userID: user.id,
          title: "Untitled Note",
        }),
      );
      return yield* navigate(`/notes/${newNoteId}`);
    });

    const finalEffect = createEffect.pipe(
      Effect.ensuring(
        Effect.sync(() => {
          this._isCreating = false;
        }),
      ),
      Effect.catchAll((err) =>
        clientLog("error", "[NotesPage] Failed to create note", err),
      ),
    );
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
                  <div class="group relative">
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
                    <button
                      @click=${() => this._deleteNote(note.id)}
                      class="absolute top-3 right-3 z-10 hidden rounded-full bg-white p-1.5 text-zinc-500 shadow-sm transition-all group-hover:block hover:bg-red-50 hover:text-red-600"
                      aria-label="Delete note"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M3 6h18" />
                        <path
                          d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                        />
                      </svg>
                    </button>
                  </div>
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
