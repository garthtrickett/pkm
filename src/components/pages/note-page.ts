// FILE: ./src/components/pages/note-page.ts
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Effect, Schema, Fiber, Duration, Exit, Cause, Option } from "effect";
import { runClientUnscoped } from "../../lib/client/runtime";
import { ReplicacheService } from "../../lib/client/replicache";
import styles from "./NotePage.module.css";
import {
  BlockSchema,
  NoteSchema,
  type AppNote,
  type Block,
  type NoteId,
  type TiptapDoc,
} from "../../lib/shared/schemas";
import { authState, type AuthModel } from "../../lib/client/stores/authStore";
import { ReactiveSamController } from "../../lib/client/reactive-sam-controller";
import type { ReadonlyJSONValue } from "replicache";
import {
  NoteNotFoundError,
  NoteParseError,
  NoteSaveError,
  type NotePageError,
} from "../../lib/client/errors";
import type { FullClientContext } from "../../lib/client/runtime";
import "../editor/tiptap-editor";

// --- Model ---
type Status = "loading" | "idle" | "saving" | "error";
interface Model {
  note: AppNote | null;
  blocks: Block[];
  status: Status;
  error: NotePageError | null;
}

// --- Actions ---
type Action =
  | { type: "INITIALIZE_START" }
  | { type: "INITIALIZE_ERROR"; payload: NotePageError }
  | { type: "DATA_UPDATED"; payload: { note: AppNote; blocks: Block[] } }
  | {
      type: "UPDATE_FIELD";
      payload: Partial<Pick<AppNote, "title" | "content">>;
    }
  | { type: "SAVE_SUCCESS" }
  | { type: "SAVE_ERROR"; payload: NoteSaveError };

// --- Pure Update Function ---
const update = (model: Model, action: Action): Model => {
  const oldStatus = model.status;
  let newState: Model;

  switch (action.type) {
    case "INITIALIZE_START":
      newState = {
        ...model,
        status: "loading",
        error: null,
        note: null,
        blocks: [],
      };
      break;
    case "INITIALIZE_ERROR":
      newState = { ...model, status: "error", error: action.payload };
      break;
    case "DATA_UPDATED":
      newState = {
        ...model,
        note: action.payload.note,
        blocks: action.payload.blocks,
        status: "idle",
        error: null,
      };
      break;
    case "UPDATE_FIELD":
      if (!model.note) {
        newState = model;
        break;
      }
      newState = {
        ...model,
        note: { ...model.note, ...action.payload },
        status: "saving",
        error: null,
      };
      break;
    case "SAVE_SUCCESS":
      newState = { ...model, status: "idle" };
      break;
    case "SAVE_ERROR":
      newState = { ...model, status: "error", error: action.payload };
      break;
    default:
      newState = model;
  }

  console.log(`[note-page update] Action: ${action.type}`, {
    oldStatus,
    newStatus: newState.status,
    hasNote: !!newState.note,
  });

  return newState;
};

@customElement("note-page")
export class NotePage extends LitElement {
  @property({ type: String })
  override id: string = "";

  // ✅ FIX: The stateful property for the editor instance is no longer needed.
  // @state()
  // private _editorInstance?: TiptapEditor;

  private ctrl = new ReactiveSamController<this, Model, Action, NotePageError>(
    this,
    { note: null, blocks: [], status: "loading", error: null },
    update,
    () => Effect.void,
  );
  private _replicacheUnsubscribe: (() => void) | undefined;
  private _authUnsubscribe: (() => void) | undefined;
  private _saveFiber: Fiber.RuntimeFiber<void, unknown> | undefined;
  private _isInitialized = false;

  private _initializeState() {
    this._replicacheUnsubscribe?.();
    this.ctrl.propose({ type: "INITIALIZE_START" });
    const setupEffect = Effect.gen(
      function* (this: NotePage) {
        if (!this.id) {
          return yield* Effect.fail(new NoteNotFoundError());
        }

        const replicache = yield* ReplicacheService;
        const noteKey = `note/${this.id}`;
        console.log(
          `[note-page] Initializing subscription for noteKey: ${noteKey}`,
        );

        this._replicacheUnsubscribe = replicache.client.subscribe(
          (tx) =>
            tx.get(noteKey).then((note) =>
              tx
                .scan({ prefix: "block/" })
                .values()
                .toArray()
                .then((allBlocks) => {
                  console.log(
                    `[note-page subscribe query] Found note: ${!!note}`,
                  );
                  return { note, allBlocks };
                }),
            ),
          (result) => {
            console.log(
              `[note-page subscribe callback] Fired. Has note: ${!!result.note}`,
            );
            if (!result.note) {
              if (this.ctrl.model.status !== "loading") {
                this.ctrl.propose({
                  type: "INITIALIZE_ERROR",
                  payload: new NoteNotFoundError(),
                });
              }
              return;
            }

            const relevantBlocks = result.allBlocks.filter(
              (b): b is ReadonlyJSONValue & { note_id: string } =>
                typeof b === "object" &&
                b !== null &&
                (b as { note_id?: unknown }).note_id === this.id,
            );
            const resilientParseEffect = Effect.gen(function* () {
              const note = yield* Schema.decodeUnknown(NoteSchema)(
                result.note,
              ).pipe(Effect.mapError((cause) => new NoteParseError({ cause })));
              const validBlocks: Block[] = [];
              for (const blockJson of relevantBlocks) {
                const blockOption =
                  Schema.decodeUnknownOption(BlockSchema)(blockJson);
                if (Option.isSome(blockOption)) {
                  validBlocks.push(blockOption.value);
                } else {
                  console.warn(
                    "[note-page] Failed to parse a block from IndexedDB. Filtering it out.",
                    { invalidData: blockJson },
                  );
                }
              }
              return { note, blocks: validBlocks };
            });
            Effect.runCallback(resilientParseEffect, {
              onExit: (exit) => {
                if (Exit.isSuccess(exit)) {
                  console.log(
                    "[note-page subscribe callback] Data parsed successfully. Proposing DATA_UPDATED.",
                  );
                  const { note, blocks } = exit.value;
                  const sortedBlocks = [...blocks].sort(
                    (a, b) => a.order - b.order,
                  );
                  this.ctrl.propose({
                    type: "DATA_UPDATED",
                    payload: { note, blocks: sortedBlocks },
                  });
                } else {
                  console.error(
                    "[note-page subscribe callback] Data parse failed.",
                    Cause.pretty(exit.cause),
                  );
                  this.ctrl.propose({
                    type: "INITIALIZE_ERROR",
                    payload: Cause.squash(exit.cause) as NotePageError,
                  });
                }
              },
            });
          },
        );
      }.bind(this),
    );
    runClientUnscoped(
      setupEffect.pipe(
        Effect.catchAll((error) =>
          Effect.sync(() =>
            this.ctrl.propose({ type: "INITIALIZE_ERROR", payload: error }),
          ),
        ),
      ),
    );
  }

  override connectedCallback() {
    super.connectedCallback();
    const handleAuthChange = (auth: AuthModel) => {
      if (auth.status === "authenticated" && !this._isInitialized) {
        this._isInitialized = true;
        this._initializeState();
      } else if (auth.status !== "authenticated" && this._isInitialized) {
        this._isInitialized = false;
        this._replicacheUnsubscribe?.();
        this.ctrl.propose({ type: "INITIALIZE_START" });
      }
    };
    this._authUnsubscribe = authState.subscribe(handleAuthChange);
    handleAuthChange(authState.value);
    window.addEventListener("pagehide", this._handlePageHide);
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has("id") && this.id && this._isInitialized) {
      this._initializeState();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._replicacheUnsubscribe?.();
    this._authUnsubscribe?.();
    window.removeEventListener("pagehide", this._handlePageHide);
    this._handlePageHide();
    if (this._saveFiber) {
      runClientUnscoped(Fiber.interrupt(this._saveFiber));
    }
  }

  private _flushChangesEffect = (): Effect.Effect<
    void,
    NoteSaveError,
    FullClientContext
  > =>
    Effect.gen(
      function* (this: NotePage) {
        console.log("[note-page _flushChangesEffect] Starting flush.");
        const replicache = yield* ReplicacheService;
        const noteToSave = this.ctrl.model.note;
        if (!noteToSave) {
          console.warn(
            "[note-page _flushChangesEffect] No note in model to save. Exiting.",
          );
          return;
        }

        // ✅ FIX: The content is now reliably read from the component's state model.
        if (!noteToSave.content) {
          console.warn(
            "[note-page _flushChangesEffect] No content in model to save. Exiting.",
          );
          return;
        }

        console.log(
          "[note-page _flushChangesEffect] Calling replicache.mutate.updateNote",
        );
        yield* Effect.tryPromise({
          try: () =>
            replicache.client.mutate.updateNote({
              id: this.id as NoteId,
              title: noteToSave.title,
              content: noteToSave.content,
            }),
          catch: (cause) => new NoteSaveError({ cause }),
        });
        console.log(
          "[note-page _flushChangesEffect] replicache.mutate.updateNote finished.",
        );
      }.bind(this),
    );

  private _handlePageHide = () => {
    if (this.ctrl.model.status !== "saving") {
      return;
    }
    if (this._saveFiber) {
      runClientUnscoped(Fiber.interrupt(this._saveFiber));
    }
    runClientUnscoped(
      this._flushChangesEffect().pipe(
        Effect.catchTag("NoteSaveError", (error) =>
          Effect.sync(() =>
            this.ctrl.propose({ type: "SAVE_ERROR", payload: error }),
          ),
        ),
      ),
    );
  };

  private _handleInput(updateField: Partial<Pick<AppNote, "title">>) {
    console.log("[note-page _handleInput] Fired for title change.");
    this.ctrl.propose({ type: "UPDATE_FIELD", payload: updateField });
    this._scheduleSave(); // Trigger a save when title changes too
  }

  // ✅ FIX: Renamed _onEditorUpdate to a more generic name and accept the event.
  private _handleEditorUpdate = (e: CustomEvent<{ content: TiptapDoc }>) => {
    console.log("[note-page _handleEditorUpdate] Fired for content change.");
    this.ctrl.propose({
      type: "UPDATE_FIELD",
      payload: { content: e.detail.content },
    });
    this._scheduleSave();
  };

  // ✅ FIX: Extracted the debouncing logic into its own method.
  private _scheduleSave = () => {
    if (this._saveFiber) {
      console.log(
        "[note-page _scheduleSave] Interrupting previous save fiber.",
      );
      runClientUnscoped(Fiber.interrupt(this._saveFiber));
    }
    const debouncedSave = Effect.sleep(Duration.millis(500)).pipe(
      Effect.andThen(this._flushChangesEffect()),
      Effect.catchTag("NoteSaveError", (error) =>
        Effect.sync(() =>
          this.ctrl.propose({ type: "SAVE_ERROR", payload: error }),
        ),
      ),
    );
    console.log("[note-page _scheduleSave] Scheduling new debounced save.");
    this._saveFiber = runClientUnscoped(debouncedSave);
  };

  protected override createRenderRoot() {
    return this;
  }

  override render() {
    const { note, error, status } = this.ctrl.model;
    const getErrorMessage = (e: NotePageError | null): string | null => {
      if (!e) return null;
      switch (e._tag) {
        case "NoteNotFoundError":
          return "This note could not be found.";
        case "NoteParseError":
          return "There was an error reading the note's data from the local database.";
        case "NoteSaveError":
          return "Failed to save changes. Please check your connection.";
      }
    };
    const errorMessage = getErrorMessage(error);

    if (status === "loading") {
      return html`<div class=${styles.container}><p>Loading note...</p></div>`;
    }

    if (!note) {
      return html`<div class=${styles.container}>
        <p class=${styles.errorText}>
          ${errorMessage || "Note could not be loaded."}
        </p>
      </div>`;
    }

    const renderStatus = () => {
      if (status === "saving") return "Saving...";
      if (status === "error")
        return html`<span class="text-red-500">${errorMessage}</span>`;
      return "Saved";
    };
    return html`
      <div class=${styles.container}>
        <div class=${styles.editor}>
          <div class=${styles.header}>
            <h2 class=${styles.headerH2}>Edit Note</h2>
            <div class=${styles.status}>${renderStatus()}</div>
          </div>
          <input
            type="text"
            class=${styles.titleInput}
            .value=${note.title}
            @input=${(e: Event) =>
              this._handleInput({
                title: (e.target as HTMLInputElement).value,
              })}
          />
          <tiptap-editor
            .initialContent=${note.content}
            @update=${this._handleEditorUpdate}
          ></tiptap-editor>
        </div>
      </div>
    `;
  }
}
