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
  type BlockId,
} from "../../lib/shared/schemas";
import { authState, type AuthModel } from "../../lib/client/stores/authStore";
import { ReactiveSamController } from "../../lib/client/reactive-sam-controller";
import type { ReadonlyJSONValue } from "replicache";
import {
  NoteNotFoundError,
  NoteParseError,
  NoteSaveError,
  NoteTaskUpdateError,
  type NotePageError,
} from "../../lib/client/errors";
import { NoteTitleExistsError } from "../../lib/shared/errors";
import type { FullClientContext } from "../../lib/client/runtime";
import { TiptapEditor } from "../editor/tiptap-editor";
import {
  convertTiptapToMarkdown,
  convertMarkdownToTiptap,
} from "../editor/tiptap-editor";
import { navigate } from "../../lib/client/router";

// --- Model ---
type Status = "loading" | "idle" | "saving" | "error";
interface Model {
  note: AppNote | null;
  blocks: Block[];
  status: Status;
  isMarkdownView: boolean;
  markdownText: string;
  error: NotePageError | NoteTitleExistsError | null;
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
  | { type: "UPDATE_MARKDOWN_TEXT"; payload: string }
  | { type: "TOGGLE_MARKDOWN_VIEW" }
  | { type: "SAVE_SUCCESS" }
  | { type: "SAVE_ERROR"; payload: NoteSaveError | NoteTitleExistsError }
  | {
      type: "UPDATE_TASK_START";
      payload: { blockId: BlockId; isComplete: boolean };
    }
  | { type: "UPDATE_TASK_ERROR"; payload: NoteTaskUpdateError }
  | { type: "NAVIGATE_TO_NOTE_BY_TITLE"; payload: { title: string } };

// --- Pure Update Function ---
const update = (model: Model, action: Action): Model => {
  // 🐞 DEBUG: Log every action and the state before the update.
  console.log(
    `%c[note-page update]%c Action: ${action.type}`,
    "color: #10B981; font-weight: bold;",
    "color: inherit;",
    { action, oldModel: { ...model } },
  );

  let newModel:

  Model;

  switch (action.type) {
    case "INITIALIZE_START":
      newModel = {
        ...model,
        status: "loading",
        error: null,
        note: null,
        blocks: [],
      };
      break;
    case "INITIALIZE_ERROR":
      newModel = { ...model, status: "error", error: action.payload };
      break;
    case "DATA_UPDATED": {
      const incomingVersion = action.payload.note.version;
      const currentVersion = model.note?.version ?? -1;

      // 🐞 DEBUG: Log the version comparison which is critical for preventing stale overwrites.
      console.log(
        `%c[note-page update]%c DATA_UPDATED version check: incoming=${incomingVersion}, current=${currentVersion}`,
        "color: #10B981; font-weight: bold;",
        "color: inherit;",
      );

      if (incomingVersion < currentVersion) {
        console.warn(
          "%c[note-page update]%c Stale DATA_UPDATED received. Ignoring.",
          "color: #FBBF24; font-weight: bold;",
          "color: inherit;",
        );
        return model;
      }

      if (model.status === "saving") {
        console.warn(
          "%c[note-page update]%c DATA_UPDATED received while saving. Ignoring to prevent overwriting user input.",
          "color: #FBBF24; font-weight: bold;",
          "color: inherit;",
        );
        return model;
      }
      newModel = {
        ...model,
        note: action.payload.note,
        blocks: action.payload.blocks,
        status: "idle",
        error: null,
      };
      break;
    }
    case "UPDATE_FIELD":
      if (!model.note) return model;
      newModel = {
        ...model,
        note: {
          ...model.note,
          ...action.payload,
        },
        status: "saving",
        error: null,
      };
      break;
    case "TOGGLE_MARKDOWN_VIEW": {
      const isSwitchingToMarkdown = !model.isMarkdownView;
      if (isSwitchingToMarkdown) {
        const markdownText = model.note
          ? convertTiptapToMarkdown(model.note.content)
          : "";
        newModel = {
          ...model,
          isMarkdownView: true,
          markdownText,
        };
      } else {
        newModel = {
          ...model,
          isMarkdownView: false,
          note: model.note
            ? {
                ...model.note,
                content: convertMarkdownToTiptap(model.markdownText),
              }
            : null,
          status: "saving",
        };
      }
      break;
    }

    case "UPDATE_MARKDOWN_TEXT":
      newModel = { ...model, markdownText: action.payload };
      break;
    case "SAVE_SUCCESS":
      newModel = { ...model, status: "idle" };
      break;
    case "SAVE_ERROR":
      newModel = { ...model, status: "error", error: action.payload };
      break;
    case "UPDATE_TASK_START":
      return { ...model, error: null };
    case "UPDATE_TASK_ERROR":
      newModel = { ...model, status: "error", error: action.payload };
      break;
    case "NAVIGATE_TO_NOTE_BY_TITLE":
      return model;
    default:
      newModel = model;
      break;
  }
  // 🐞 DEBUG: Log the new state after the update.
  console.log(
    `%c[note-page update]%c New state after '${action.type}'`,
    "color: #10B981; font-weight: bold;",
    "color: inherit;",
    { newModel: { ...newModel } },
  );
  return newModel;
};

// --- Effectful Action Handler ---
const handleAction = (
  action: Action,
  model: Model,
): Effect.Effect<
  void,
  NotePageError,
  ReplicacheService | FullClientContext
> => {
  switch (action.type) {
    case "TOGGLE_MARKDOWN_VIEW":
      if (!model.isMarkdownView) {
        // This is a placeholder for scheduling save, which will be added later
      }
      return Effect.void;
    case "UPDATE_TASK_START": {
      return Effect.gen(function* () {
        const replicache = yield* ReplicacheService;
        yield* Effect.tryPromise({
          try: () => replicache.client.mutate.updateTask(action.payload),
          catch: (cause) => new NoteTaskUpdateError({ cause }),
        });
      });
    }
    case "NAVIGATE_TO_NOTE_BY_TITLE": {
      const { title } = action.payload;

      return Effect.gen(function* () {
        const replicache = yield* ReplicacheService;
        const noteJsons = yield* Effect.promise(() =>
          replicache.client.query((tx) =>
            tx.scan({ prefix: "note/" }).values().toArray(),
          ),
        );

        const notes: AppNote[] = noteJsons.flatMap((json) => {
          const option = Schema.decodeUnknownOption(NoteSchema)(json);

          return Option.isSome(option) ? [option.value] : [];
        });

        const targetNote = notes.find((note) => note.title === title);

        if (targetNote) {
          yield* navigate(`/notes/${targetNote.id}`);
        } else {
          yield* Effect.logWarning(
            `Note with title "${title}" not found \nfor navigation.`,
          );
        }
      }).pipe(
        Effect.catchAll((error) =>
          Effect.logError("Navigation effect failed", { error }),
        ),
      );
    }
    default:
      return Effect.void;
  }
};

@customElement("note-page")
export class NotePage extends LitElement {
  @property({ type: String })
  override id: string = "";
  private _handleTitleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent any default form submission behavior
      const editorElement = this.querySelector<TiptapEditor>("tiptap-editor");
      editorElement?.focusEditor();
    }
  };

  private ctrl = new ReactiveSamController<
    this,
    Model,
    Action,
    NotePageError | NoteTitleExistsError
  >(
    this,
    {
      note: null,
      blocks: [],
      status: "loading",
      isMarkdownView: false,
      markdownText: "",

      error: null,
    },
    update,
    (action, model, propose) =>
      handleAction(action, model).pipe(
        Effect.catchTag("NoteTaskUpdateError", (err) =>
          Effect.sync(() =>
            propose({ type: "UPDATE_TASK_ERROR", payload: err }),
          ),
        ),
      ),
  );
  private _isInitialized = false;
  private _replicacheUnsubscribe: (() => void) | undefined;
  private _authUnsubscribe: (() => void) | undefined;
  private _saveFiber: Fiber.RuntimeFiber<void, unknown> | undefined;

  private _handleTaskUpdate = (
    e: CustomEvent<{ blockId: BlockId; isComplete: boolean }>,
  ) => {
    this.ctrl.propose({ type: "UPDATE_TASK_START", payload: e.detail });
  };

  private _handleEditorClick = (event: MouseEvent) => {
    const linkElement = (event.target as HTMLElement).closest(
      "a[data-link-target]",
    );

    if (linkElement) {
      event.preventDefault();
      const linkTarget = linkElement.getAttribute("data-link-target");
      if (linkTarget) {
        this.ctrl.propose({
          type: "NAVIGATE_TO_NOTE_BY_TITLE",
          payload: { title: linkTarget },
        });
      }
    }
  };

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

        this._replicacheUnsubscribe = replicache.client.subscribe(
          (tx) =>
            tx.get(noteKey).then((note) =>
              tx
                .scan({ prefix: "block/" })
                .values()
                .toArray()

                .then((allBlocks) => {
                  return { note, allBlocks };
                }),
            ),
          (result) => {
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
        const replicache = yield* ReplicacheService;
        const noteToSave = this.ctrl.model.note;

        if (!noteToSave || !noteToSave.content) {
          return;
        }
        yield* Effect.tryPromise({
          try: () =>
            replicache.client.mutate.updateNote({
              id: this.id as NoteId,
              title: noteToSave.title,

              content: noteToSave.content,
            }),
          catch: (cause) => new NoteSaveError({ cause }),
        });
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
    this.ctrl.propose({ type: "UPDATE_FIELD", payload: updateField });
    this._scheduleSave();
  }

  private _handleEditorUpdate = (e: CustomEvent<{ content: TiptapDoc }>) => {
    this.ctrl.propose({
      type: "UPDATE_FIELD",
      payload: { content: e.detail.content },
    });
    this._scheduleSave();
  };

  private _scheduleSave = () => {
    // Interrupt any previously scheduled save
    if (this._saveFiber) {
      runClientUnscoped(Fiber.interrupt(this._saveFiber));
    }

    // The new logic with the client-side check
    const debouncedSaveWithCheck = Effect.gen(
      function* (this: NotePage) {
        // 1. Get the current note's title and ID from the component's state.
        const noteToSave = this.ctrl.model.note;
        if (!noteToSave) return;

        const replicache = yield* ReplicacheService;

        // 2. Query all notes from the local Replicache cache.
        const allNotesJson = yield* Effect.promise(() =>
          replicache.client.query((tx) =>
            tx.scan({ prefix: "note/" }).values().toArray(),
          ),
        );
        const allNotes: AppNote[] = allNotesJson.flatMap((json) =>
          Schema.decodeUnknownOption(NoteSchema)(json).pipe(Option.toArray),
        );

        // 3. Check if any *other* note has the same title (case-insensitive).
        const isDuplicate = allNotes.some(
          (note) =>
            note.id !== noteToSave.id &&
            note.title.toLowerCase().trim() ===
              noteToSave.title.toLowerCase().trim(),
        );

        if (isDuplicate) {
          // 4. If it's a duplicate, fail with a specific error.
          return yield* Effect.fail(new NoteTitleExistsError());
        }

        // 5. If it's unique, proceed with the original save logic.
        yield* this._flushChangesEffect();
      }.bind(this),
    );

    // This part remains the same
    const finalEffect = Effect.sleep(Duration.millis(500)).pipe(
      Effect.andThen(debouncedSaveWithCheck),
      Effect.match({
        onFailure: (error) =>
          this.ctrl.propose({ type: "SAVE_ERROR", payload: error }),
        onSuccess: () => this.ctrl.propose({ type: "SAVE_SUCCESS" }),
      }),
    );
    this._saveFiber = runClientUnscoped(finalEffect);
  };

  private _handleMarkdownInput = (e: Event) => {
    const markdownText = (e.target as HTMLTextAreaElement).value;
    this.ctrl.propose({
      type: "UPDATE_MARKDOWN_TEXT",
      payload: markdownText,
    });
  };

  private _handleMarkdownKeyDown = (e: KeyboardEvent) => {
    const target = e.target as HTMLTextAreaElement;
    const { selectionStart, value } = target;

    if (e.key === "Tab") {
      e.preventDefault();
      const indent = "  ";
      let lineStart = selectionStart;
      while (lineStart > 0 && value[lineStart - 1] !== "\n") {
        lineStart--;
      }

      if (e.shiftKey) {
        if (value.substring(lineStart, lineStart + indent.length) === indent) {
          target.value =
            value.substring(0, lineStart) +
            value.substring(lineStart + indent.length);
          target.selectionStart = target.selectionEnd = Math.max(
            lineStart,
            selectionStart - indent.length,
          );
        }
      } else {
        target.value =
          value.substring(0, lineStart) + indent + value.substring(lineStart);
        target.selectionStart = target.selectionEnd =
          selectionStart + indent.length;
      }
      target.dispatchEvent(
        new Event("input", { bubbles: true, composed: true }),
      );
    } else if (e.key === "Enter") {
      let lineStart = selectionStart;
      while (lineStart > 0 && value[lineStart - 1] !== "\n") {
        lineStart--;
      }
      const currentLine = value.substring(lineStart, selectionStart);
      const listMarkerMatch = currentLine.match(/^(\s*([-*]|\d+\.\s))/);

      if (listMarkerMatch) {
        e.preventDefault();
        const marker = listMarkerMatch[1];
        let nextMarker = marker;

        if (marker) {
          const numberedListMatch = marker.match(/^(\s*)(\d+)\.\s/);
          if (
            numberedListMatch &&
            numberedListMatch[1] !== undefined &&
            numberedListMatch[2]
          ) {
            const num = parseInt(numberedListMatch[2], 10);
            nextMarker = `${numberedListMatch[1]}${num + 1}. `;
          }
        }

        const textToInsert = "\n" + (nextMarker || "");
        target.value =
          value.substring(0, selectionStart) +
          textToInsert +
          value.substring(selectionStart);
        target.selectionStart = target.selectionEnd =
          selectionStart + textToInsert.length;
        target.dispatchEvent(
          new Event("input", { bubbles: true, composed: true }),
        );
      }
    }
  };

  protected override createRenderRoot() {
    return this;
  }

  override render() {
    const { note, error, status, isMarkdownView } = this.ctrl.model;
    const getErrorMessage = (
      e: NotePageError | NoteTitleExistsError | null,
    ): string | null => {
      if (!e) return null;
      switch (e._tag) {
        case "NoteNotFoundError":
          return "This note could not be found.";
        case "NoteParseError":
          return "There was an error reading the note's data from the local database.";
        case "NoteSaveError":
          return "Failed to save changes. Please check your connection.";
        case "NoteTitleExistsError":
          return "A note with this title already exists.";
        case "NoteTaskUpdateError":
          return "Failed to update task. Please check your connection.";
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

    const editorClasses = [
      styles.viewSwitcherButton,

      !isMarkdownView ? styles.viewSwitcherButtonActive : "",
    ]
      .filter(Boolean)
      .join(" ");

    const markdownClasses = [
      styles.viewSwitcherButton,
      isMarkdownView ? styles.viewSwitcherButtonActive : "",
    ]
      .filter(Boolean)
      .join(" ");

    return html`
      <div class=${styles.container}>
        <div class=${styles.editor}>
          <div class=${styles.header}>
            <h2 class=${styles.headerH2}>Edit Note</h2>
            <div class="flex items-center gap-4">
              <div class=${styles.viewSwitcherContainer}>
                <button
                  class=${editorClasses}
                  ?disabled=${!isMarkdownView}
                  @click=${() =>
                    this.ctrl.propose({ type: "TOGGLE_MARKDOWN_VIEW" })}
                >
                  Editor
                </button>

                <button
                  class=${markdownClasses}
                  ?disabled=${isMarkdownView}
                  @click=${() =>
                    this.ctrl.propose({ type: "TOGGLE_MARKDOWN_VIEW" })}
                >
                  Markdown
                </button>
              </div>
              <div class=${styles.status}>${renderStatus()}</div>
            </div>
          </div>
          <input
            type="text"
            class=${styles.titleInput}
            .value=${note.title}
            @input=${(e: Event) =>
              this._handleInput({
                title: (e.target as HTMLInputElement).value,
              })}
            @keydown=${this._handleTitleKeyDown}
          />

          ${this.ctrl.model.isMarkdownView
            ? html`<textarea
                class=${styles.markdownPreview}
                .value=${this.ctrl.model.markdownText}
                @input=${this._handleMarkdownInput}
                @keydown=${this._handleMarkdownKeyDown}
              ></textarea>`
            : html`<tiptap-editor
                .initialContent=${note.content}
                @update=${this._handleEditorUpdate}
                @update-task-status=${this._handleTaskUpdate}
                @click=${this._handleEditorClick}
              ></tiptap-editor>`}
        </div>
      </div>
    `;
  }
}
