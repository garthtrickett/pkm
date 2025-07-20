// FILE: ./src/components/pages/note-page.ts
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit-html/directives/repeat.js";
import { Effect, Schema, Fiber, Duration, Exit } from "effect";
import { runClientPromise, runClientUnscoped } from "../../lib/client/runtime";
import { ReplicacheService } from "../../lib/client/replicache";
import styles from "./NotePage.module.css";
import {
  BlockSchema,
  NoteSchema,
  type Block,
  type Note,
  type NoteId,
} from "../../lib/shared/schemas";
import { clientLog } from "../../lib/client/clientLog";
import { authState, type AuthModel } from "../../lib/client/stores/authStore";
import { SamController } from "../../lib/client/sam-controller";
import type { ReadonlyJSONValue } from "replicache";

// --- Model ---
type Status = "loading" | "idle" | "saving" | "error";
interface Model {
  note: Note | null;
  blocks: Block[];
  status: Status;
  error: string | null;
}

// --- Actions ---
type Action =
  | { type: "INITIALIZE_START" }
  | { type: "INITIALIZE_ERROR"; payload: string }
  | { type: "DATA_UPDATED"; payload: { note: Note; blocks: Block[] } }
  | { type: "DATA_NOT_FOUND" }
  | { type: "UPDATE_FIELD"; payload: Partial<Pick<Note, "title" | "content">> }
  | { type: "SAVE_SUCCESS" }
  | { type: "SAVE_ERROR"; payload: string };

// --- Pure Update Function ---
const update = (model: Model, action: Action): Model => {
  switch (action.type) {
    case "INITIALIZE_START":
      return {
        ...model,
        status: "loading",
        error: null,
        note: null,
        blocks: [],
      };
    case "INITIALIZE_ERROR":
      return { ...model, status: "error", error: action.payload };
    case "DATA_UPDATED":
      // Avoid overwriting local edits that are in the process of saving
      if (model.status === "saving") {
        return {
          ...model,
          blocks: action.payload.blocks,
        };
      }
      return {
        ...model,
        note: action.payload.note,
        blocks: action.payload.blocks,
        status: "idle",
      };
    case "DATA_NOT_FOUND":
      return { ...model, status: "error", error: "Note not found." };
    case "UPDATE_FIELD":
      if (!model.note) return model;
      return {
        ...model,
        note: { ...model.note, ...action.payload },
        status: "saving",
      };
    case "SAVE_SUCCESS":
      return { ...model, status: "idle" };
    case "SAVE_ERROR":
      return { ...model, status: "error", error: action.payload };
  }
};

@customElement("note-page")
export class NotePage extends LitElement {
  @property({ type: String })
  override id: string = "";

  private ctrl = new SamController<this, Model, Action, never>(
    this,
    { note: null, blocks: [], status: "loading", error: null },
    update,
    // No complex side effects are handled by the controller directly in this case
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
          this.ctrl.propose({
            type: "INITIALIZE_ERROR",
            payload: "Note ID is missing.",
          });
          return;
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
                .then((allBlocks) => ({ note, allBlocks })),
            ),
          (result) => {
            if (!result.note) {
              this.ctrl.propose({ type: "DATA_NOT_FOUND" });
              return;
            }

            // ✅ THIS IS THE FIX ✅
            // Type-safely filter the blocks before attempting to decode them.
            const relevantBlocks = result.allBlocks.filter(
              (
                b,
              ): b is ReadonlyJSONValue & {
                note_id: string;
              } =>
                typeof b === "object" &&
                b !== null &&
                (b as { note_id?: unknown }).note_id === this.id,
            );

            const parseResult = Effect.all({
              note: Schema.decodeUnknown(NoteSchema)(result.note),
              blocks: Schema.decodeUnknown(Schema.Array(BlockSchema))(
                relevantBlocks,
              ),
            });

            Effect.runCallback(parseResult, {
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
                  this.ctrl.propose({
                    type: "INITIALIZE_ERROR",
                    payload: "Failed to parse note data.",
                  });
                  runClientUnscoped(
                    clientLog("error", "Failed to decode data", {
                      cause: exit.cause,
                    }),
                  );
                }
              },
            });
          },
        );
      }.bind(this),
    );

    void runClientPromise(setupEffect);
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
        this.ctrl.propose({ type: "INITIALIZE_START" }); // Reset state
      }
    };
    this._authUnsubscribe = authState.subscribe(handleAuthChange);
    handleAuthChange(authState.value);
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
    if (this._saveFiber) {
      runClientUnscoped(Fiber.interrupt(this._saveFiber));
    }
  }

  private _handleInput(updateField: Partial<Pick<Note, "title" | "content">>) {
    this.ctrl.propose({ type: "UPDATE_FIELD", payload: updateField });

    if (this._saveFiber) {
      runClientUnscoped(Fiber.interrupt(this._saveFiber));
    }

    const saveEffect = Effect.gen(
      function* (this: NotePage) {
        yield* Effect.sleep(Duration.millis(500));
        const replicache = yield* ReplicacheService;
        const noteToSave = this.ctrl.model.note;
        if (!noteToSave) return;

        yield* Effect.promise(() =>
          replicache.client.mutate.updateNote({
            id: this.id as NoteId,
            title: noteToSave.title,
            content: noteToSave.content,
          }),
        );
      }.bind(this),
    ).pipe(
      Effect.matchEffect({
        onSuccess: () =>
          Effect.sync(() => this.ctrl.propose({ type: "SAVE_SUCCESS" })),
        onFailure: (err) =>
          clientLog("error", `Save failed for note ${this.id}`, err).pipe(
            Effect.andThen(
              Effect.sync(() =>
                this.ctrl.propose({
                  type: "SAVE_ERROR",
                  payload: "Failed to save note.",
                }),
              ),
            ),
          ),
      }),
    );
    this._saveFiber = runClientUnscoped(saveEffect);
  }

  protected override createRenderRoot() {
    return this;
  }

  override render() {
    const { note, blocks, status, error } = this.ctrl.model;

    // --- ✅ START OF FIX ---
    // Case 1: Still loading the initial data.
    if (status === "loading") {
      return html`<div class=${styles.container}><p>Loading note...</p></div>`;
    }

    // Case 2: A fatal error occurred during initialization (e.g., note not found).
    // We know this because `note` is still null, even though we are not loading.
    if (!note) {
      return html`<div class=${styles.container}>
        <p class=${styles.errorText}>${error || "Note could not be loaded."}</p>
      </div>`;
    }
    // --- ✅ END OF FIX ---

    // At this point, we know we have a note, so we can render the editor.
    // The status can be 'idle', 'saving', or 'error' (from a failed save).
    const renderStatus = () => {
      if (status === "saving") return "Saving...";
      if (status === "error") return "Error saving"; // This is now reachable
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
          <textarea
            class=${styles.contentInput}
            .value=${note.content}
            @input=${(e: Event) =>
              this._handleInput({
                content: (e.target as HTMLTextAreaElement).value,
              })}
            placeholder="Start writing your note..."
          ></textarea>
          <div class=${styles.blocksContainer}>
            <h3 class=${styles.blocksHeader}>Parsed Blocks (Live Preview)</h3>
            ${blocks.length > 0
              ? repeat(
                  blocks,
                  (block) => block.id,
                  (block) => html`
                    <div
                      class=${styles.blockItem}
                      style="margin-left: ${block.depth * 1.5}rem"
                    >
                      <strong class=${styles.blockType}>[${block.type}]</strong>
                      <span>${block.content}</span>
                    </div>
                  `,
                )
              : html`<p class=${styles.noBlocksText}>
                  No blocks parsed from content yet.
                </p>`}
          </div>
        </div>
      </div>
    `;
  }
}
