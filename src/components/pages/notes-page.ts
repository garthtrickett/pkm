// FILE: src/components/pages/notes-page.ts
import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";
import { repeat } from "lit-html/directives/repeat.js";
import { Effect, Option, Schema } from "effect";
import { runClientPromise, runClientUnscoped } from "../../lib/client/runtime";
import { ReplicacheService } from "../../lib/client/replicache";
import { authState, type AuthModel } from "../../lib/client/stores/authStore";
import { navigate } from "../../lib/client/router";
import { NotionButton } from "../ui/notion-button";
import styles from "./NotesView.module.css";
import {
  NoteSchema,
  type AppNote,
  type NoteId,
  type TiptapDoc,
  type TiptapNode,
} from "../../lib/shared/schemas";
import { clientLog } from "../../lib/client/clientLog";
import { RpcLogClient } from "../../lib/client/rpc";
import { v4 as uuidv4 } from "uuid";
import { ReactiveSamController } from "../../lib/client/reactive-sam-controller";
import type { LocationService } from "../../lib/client/LocationService";
import type { ReadonlyJSONValue } from "replicache";
import {
  NoteCreationError,
  NoteDeletionError,
  type NotesPageError,
} from "../../lib/client/errors";

// Utility to get plain text from a Tiptap document
const getTextFromTiptapDoc = (doc: TiptapDoc): string => {
  // Guard against null/undefined doc or content
  if (!doc?.content) {
    return "";
  }

  // Recursive helper function to process an array of nodes
  const traverse = (nodes: readonly TiptapNode[]): string => {
    return nodes
      .map((node) => {
        // Type-safe switch on the node's `type` property
        switch (node.type) {
          case "text":
            // This is a text node, return its content directly.
            return node.text;

          // These are container nodes.
          case "paragraph":
          case "listItem":
          case "bulletList":
            // If they have content, recursively traverse it.
            return node.content ? traverse(node.content) : "";

          // Handle any other node types we don't care about.
          default:
            return "";
        }
      })
      .join(""); // Concatenate the text from all children
  };

  // Start the traversal and trim the final result
  return traverse(doc.content).trim();
};

// --- Model ---
type Status = "loading" | "idle" | "error";
interface Model {
  notes: AppNote[];
  isCreating: boolean;
  error: NotesPageError | null;
  status: Status;
}

// --- Actions ---
type Action =
  | { type: "INITIALIZE_START" }
  | { type: "NOTES_UPDATED"; payload: AppNote[] }
  | { type: "INITIALIZE_ERROR"; payload: NotesPageError }
  | { type: "CREATE_NOTE_START" }
  | { type: "CREATE_NOTE_COMPLETE" }
  | { type: "CREATE_NOTE_ERROR"; payload: NoteCreationError }
  | { type: "DELETE_NOTE"; payload: NoteId }
  | { type: "DELETE_NOTE_ERROR"; payload: NoteDeletionError }
  | { type: "CLEAR_ERROR" };

// --- Pure Update Function ---
const update = (model: Model, action: Action): Model => {
  switch (action.type) {
    case "INITIALIZE_START":
      return { ...model, status: "loading", error: null };
    case "INITIALIZE_ERROR":
      return { ...model, status: "error", error: action.payload };
    case "NOTES_UPDATED":
      return {
        ...model,
        status: "idle",
        notes: action.payload.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        ),
      };
    case "CREATE_NOTE_START":
      return { ...model, isCreating: true, error: null };
    case "CREATE_NOTE_COMPLETE":
      return { ...model, isCreating: false };
    case "CREATE_NOTE_ERROR":
      return { ...model, isCreating: false, error: action.payload };
    case "DELETE_NOTE":
      return { ...model, error: null };
    case "DELETE_NOTE_ERROR":
      return { ...model, error: action.payload };
    case "CLEAR_ERROR":
      return { ...model, error: null };
  }
};

// --- Effectful Action Handler ---
const handleAction = (
  action: Action,
  _model: Model,
  propose: (a: Action) => void,
): Effect.Effect<
  void,
  NotesPageError,
  ReplicacheService | RpcLogClient | LocationService
> => {
  switch (action.type) {
    case "CREATE_NOTE_START": {
      const createEffect = Effect.gen(function* () {
        const replicache = yield* ReplicacheService;
        const user = authState.value.user!;
        const newNoteId = uuidv4() as NoteId;
        yield* Effect.tryPromise({
          try: () =>
            replicache.client.mutate.createNote({
              id: newNoteId,
              userID: user.id,
              title: "Untitled Note",
            }),
          catch: (cause) => new NoteCreationError({ cause }),
        });

        yield* navigate(`/notes/${newNoteId}`).pipe(
          Effect.mapError((cause) => new NoteCreationError({ cause })),
        );
      });
      return createEffect.pipe(
        Effect.ensuring(
          Effect.sync(() => propose({ type: "CREATE_NOTE_COMPLETE" })),
        ),
      );
    }
    case "DELETE_NOTE": {
      return Effect.gen(function* () {
        const replicache = yield* ReplicacheService;
        yield* Effect.tryPromise({
          try: () =>
            replicache.client.mutate.deleteNote({ id: action.payload }),
          catch: (cause) => new NoteDeletionError({ cause }),
        });
      });
    }
    default:
      return Effect.void;
  }
};
@customElement("notes-page")
export class NotesPage extends LitElement {
  private ctrl = new ReactiveSamController<this, Model, Action, NotesPageError>(
    this,
    { notes: [], isCreating: false, error: null, status: "loading" },
    update,
    (action, model, propose) =>
      handleAction(action, model, propose).pipe(
        Effect.catchTag("NoteCreationError", (err) =>
          Effect.sync(() =>
            propose({ type: "CREATE_NOTE_ERROR", payload: err }),
          ),
        ),
        Effect.catchTag("NoteDeletionError", (err) =>
          Effect.sync(() =>
            propose({ type: "DELETE_NOTE_ERROR", payload: err }),
          ),
        ),
      ),
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
        this.ctrl.propose({ type: "INITIALIZE_START" });
        const replicache = yield* ReplicacheService;

        this._replicacheUnsubscribe?.();

        this._replicacheUnsubscribe = replicache.client.subscribe(
          async (tx) => {
            const noteJSONs = await tx
              .scan({ prefix: "note/" })
              .values()
              .toArray();
            return noteJSONs;
          },
          (noteJSONs: ReadonlyJSONValue[]) => {
            const notes: AppNote[] = noteJSONs.flatMap((json) => {
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
        this.ctrl.propose({ type: "NOTES_UPDATED", payload: [] });
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
    const { notes, isCreating, error, status } = this.ctrl.model;
    const getErrorMessage = (e: NotesPageError | null): string | null => {
      if (!e) return null;
      switch (e._tag) {
        case "NoteCreationError":
          return "Could not create a new note. Please try again.";
        case "NoteDeletionError":
          return "Could not delete the note. Please try again.";
      }
    };
    const errorMessage = getErrorMessage(error);

    if (status === "loading") {
      return html`
        <div class=${styles.container}>
          <div class=${styles.emptyState}>
            <p>Loading notes...</p>
          </div>
        </div>
      `;
    }

    return html`
      <div class=${styles.container}>
        ${errorMessage
          ? // --- MODIFIED ERROR BLOCK ---
            html`<div
              class="mb-4 flex items-center justify-between rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <span>${errorMessage}</span>
              <button
                @click=${() => this.ctrl.propose({ type: "CLEAR_ERROR" })}
                class="rounded-full p-1 text-red-600 transition-colors hover:bg-red-100"
                aria-label="Dismiss error"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>`
          : ""}
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
                (note) => {
                  const contentPreview = getTextFromTiptapDoc(note.content);
                  return html`
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
                          ${contentPreview
                            ? contentPreview.substring(0, 100) +
                              (contentPreview.length > 100 ? "..." : "")
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
                  `;
                },
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
