// FILE: ./src/components/pages/notes-page.ts
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { repeat } from "lit-html/directives/repeat.js";
import { Effect, Option, Schema } from "effect";
import { runClientUnscoped, runClientPromise } from "../../lib/client/runtime";
import { ReplicacheService } from "../../lib/client/replicache";
import { authState, type AuthModel } from "../../lib/client/stores/authStore";
import { navigate } from "../../lib/client/router";
import { NotionButton } from "../ui/notion-button";
import styles from "./NotesView.module.css";
import { NoteSchema, type Note, type NoteId } from "../../lib/shared/schemas";
import { clientLog, RpcLogClient } from "../../lib/client/clientLog";
import { v4 as uuidv4 } from "uuid";
import { SamController } from "../../lib/client/sam-controller";
import type { LocationService } from "../../lib/client/LocationService";
// ✅ 1. Import the specific type from Replicache
import type { ReadonlyJSONValue } from "replicache";

// --- Model ---
interface Model {
  notes: Note[];
  isCreating: boolean;
}

// --- Actions ---
type Action =
  | { type: "NOTES_UPDATED"; payload: Note[] }
  | { type: "CREATE_NOTE_START" }
  | { type: "CREATE_NOTE_COMPLETE" } // Used to reset loading state
  | { type: "DELETE_NOTE"; payload: NoteId };

// --- Pure Update Function ---
const update = (model: Model, action: Action): Model => {
  switch (action.type) {
    case "NOTES_UPDATED":
      return {
        ...model,
        notes: action.payload.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        ),
      };
    case "CREATE_NOTE_START":
      return { ...model, isCreating: true };
    case "CREATE_NOTE_COMPLETE":
      return { ...model, isCreating: false };
    case "DELETE_NOTE":
      // The actual deletion from the list will happen reactively
      // when Replicache triggers a NOTES_UPDATED action.
      // This action is just for triggering the side effect.
      return model;
  }
};

// --- Effectful Action Handler ---
const handleAction = (
  action: Action,
  _model: Model,
  propose: (a: Action) => void,
): Effect.Effect<
  void,
  never,
  ReplicacheService | RpcLogClient | LocationService
> => {
  switch (action.type) {
    case "CREATE_NOTE_START": {
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
        yield* navigate(`/notes/${newNoteId}`);
      });

      return createEffect.pipe(
        Effect.ensuring(
          Effect.sync(() => propose({ type: "CREATE_NOTE_COMPLETE" })),
        ),
        Effect.catchAll((err) =>
          clientLog("error", "[NotesPage] Failed to create note", err),
        ),
      );
    }

    case "DELETE_NOTE": {
      return Effect.gen(function* () {
        const replicache = yield* ReplicacheService;
        yield* Effect.promise(() =>
          replicache.client.mutate.deleteNote({ id: action.payload }),
        );
      }).pipe(
        Effect.catchAll((err) =>
          clientLog(
            "error",
            `[NotesPage] Failed to delete note ${action.payload}`,
            err,
          ),
        ),
      );
    }
    default:
      return Effect.void;
  }
};

@customElement("notes-page")
export class NotesPage extends LitElement {
  private ctrl = new SamController<this, Model, Action, never>(
    this,
    { notes: [], isCreating: false },
    update,
    handleAction,
  );

  private _isInitialized = false;
  private _replicacheUnsubscribe: (() => void) | undefined;
  private _authUnsubscribe: (() => void) | undefined;

  private _initializeReplicacheSubscription() {
    const initEffect = Effect.gen(
      function* (this: NotesPage) {
        yield* clientLog(
          "info",
          "[NotesPage] Component connected, initializing Replicache subscription.",
        );
        const replicache = yield* ReplicacheService;

        // Unsubscribe from any previous subscription before creating a new one
        this._replicacheUnsubscribe?.();

        this._replicacheUnsubscribe = replicache.client.subscribe(
          // 1. The "query" function: simply returns raw JSON data from the cache.
          async (tx) => {
            const noteJSONs = await tx
              .scan({ prefix: "note/" })
              .values()
              .toArray();
            return noteJSONs;
          },
          // 2. The "onData" callback with the correct type.
          // ✅ FIX: Replace `any[]` with `ReadonlyJSONValue[]` for type safety.
          (noteJSONs: ReadonlyJSONValue[]) => {
            const notes: Note[] = noteJSONs.flatMap((json) => {
              const option = Schema.decodeUnknownOption(NoteSchema)(json);
              return Option.isSome(option) ? [option.value] : [];
            });

            this.ctrl.propose({ type: "NOTES_UPDATED", payload: notes });
          },
        );
      }.bind(this),
    );
    void runClientPromise(initEffect);
  }

  override connectedCallback() {
    super.connectedCallback();

    const handleAuthChange = (auth: AuthModel) => {
      if (auth.status === "authenticated" && !this._isInitialized) {
        this._isInitialized = true;
        this._initializeReplicacheSubscription();
      } else if (auth.status !== "authenticated" && this._isInitialized) {
        this._isInitialized = false;
        this._replicacheUnsubscribe?.();
        this.ctrl.propose({ type: "NOTES_UPDATED", payload: [] }); // Clear notes
      }
    };

    this._authUnsubscribe = authState.subscribe(handleAuthChange);
    handleAuthChange(authState.value);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._replicacheUnsubscribe?.();
    this._authUnsubscribe?.();
    runClientUnscoped(clientLog("info", "[NotesPage] Component disconnected."));
  }

  protected override createRenderRoot() {
    return this;
  }

  override render() {
    const { notes, isCreating } = this.ctrl.model;

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
              children: isCreating ? "Creating..." : "Create New Note",
              onClick: () => this.ctrl.propose({ type: "CREATE_NOTE_START" }),
              loading: isCreating,
            })}
          </div>
        </div>
        <div class=${styles.notesList}>
          ${notes.length > 0
            ? repeat(
                notes,
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
                      @click=${() =>
                        this.ctrl.propose({
                          type: "DELETE_NOTE",
                          payload: note.id,
                        })}
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
