// FILE: ./src/components/pages/note-page.ts
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit-html/directives/repeat.js";
import { Effect, Schema, Fiber, Duration, Exit, Cause, Either } from "effect";
import { runClientUnscoped } from "../../lib/client/runtime";
import { ReplicacheService } from "../../lib/client/replicache";
import styles from "./NotePage.module.css";
import {
  BlockSchema,
  NoteSchema,
  type Block,
  type Note,
  type NoteId,
} from "../../lib/shared/schemas";
import { authState, type AuthModel } from "../../lib/client/stores/authStore";
import { SamController } from "../../lib/client/sam-controller";
import type { ReadonlyJSONValue } from "replicache";
import {
  NoteNotFoundError,
  NoteParseError,
  NoteSaveError,
  type NotePageError,
} from "../../lib/client/errors";
import type { FullClientContext } from "../../lib/client/runtime";

// --- Model ---
type Status = "loading" | "idle" | "saving" | "error";
interface Model {
  note: Note | null;
  blocks: Block[];
  status: Status;
  error: NotePageError | null;
}

// --- Actions ---
type Action =
  | { type: "INITIALIZE_START" }
  | { type: "INITIALIZE_ERROR"; payload: NotePageError }
  | { type: "DATA_UPDATED"; payload: { note: Note; blocks: Block[] } }
  | { type: "UPDATE_FIELD"; payload: Partial<Pick<Note, "title" | "content">> }
  | { type: "SAVE_SUCCESS" }
  | { type: "SAVE_ERROR"; payload: NoteSaveError };

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
        error: null,
      };
    case "UPDATE_FIELD":
      if (!model.note) return model;
      return {
        ...model,
        note: { ...model.note, ...action.payload },
        status: "saving",
        error: null,
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

  private ctrl = new SamController<this, Model, Action, NotePageError>(
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
              this.ctrl.propose({
                type: "INITIALIZE_ERROR",
                payload: new NoteNotFoundError(),
              });
              return;
            }

            const relevantBlocks = result.allBlocks.filter(
              (b): b is ReadonlyJSONValue & { note_id: string } =>
                typeof b === "object" &&
                b !== null &&
                (b as { note_id?: unknown }).note_id === this.id,
            );
            const parseResult = Effect.all({
              note: Schema.decodeUnknown(NoteSchema)(result.note),
              blocks: Schema.decodeUnknown(Schema.Array(BlockSchema))(
                relevantBlocks,
              ),
            }).pipe(Effect.mapError((cause) => new NoteParseError({ cause })));
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
    // ADDED: Add event listener for pagehide
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
    // ADDED: Remove event listener and flush changes on disconnect
    window.removeEventListener("pagehide", this._handlePageHide);
    this._handlePageHide(); // Also flush on component removal
    if (this._saveFiber) {
      runClientUnscoped(Fiber.interrupt(this._saveFiber));
    }
  }

  // ADDED: Extracted save logic into a reusable Effect
  private _flushChangesEffect = (): Effect.Effect<
    void,
    never,
    FullClientContext
  > =>
    Effect.gen(
      function* (this: NotePage) {
        const replicache = yield* ReplicacheService;
        const noteToSave = this.ctrl.model.note;
        if (!noteToSave) {
          return;
        }

        const mutationEffect = Effect.tryPromise({
          try: () =>
            replicache.client.mutate.updateNote({
              id: this.id as NoteId,
              title: noteToSave.title,
              content: noteToSave.content,
            }),
          catch: (cause) => new NoteSaveError({ cause }),
        });

        // This effect resolves to an Either<NoteSaveError, void>
        const result = yield* Effect.either(mutationEffect);

        // Check if the Either is a Right (success)
        if (Either.isRight(result)) {
          this.ctrl.propose({ type: "SAVE_SUCCESS" });
        } else {
          // If it's a Left (failure), the error is in the .left property
          this.ctrl.propose({
            type: "SAVE_ERROR",
            payload: result.left, // The error is directly here
          });
        }
      }.bind(this),
    );

  // ADDED: New handler for the pagehide event
  private _handlePageHide = () => {
    if (this.ctrl.model.status !== "saving") {
      return;
    }
    if (this._saveFiber) {
      runClientUnscoped(Fiber.interrupt(this._saveFiber));
    }
    // Run the save effect immediately without the debounce
    runClientUnscoped(this._flushChangesEffect());
  };

  // MODIFIED: Simplified input handler
  private _handleInput(updateField: Partial<Pick<Note, "title" | "content">>) {
    this.ctrl.propose({ type: "UPDATE_FIELD", payload: updateField });

    if (this._saveFiber) {
      runClientUnscoped(Fiber.interrupt(this._saveFiber));
    }

    const debouncedSave = Effect.sleep(Duration.millis(500)).pipe(
      Effect.andThen(this._flushChangesEffect()),
    );

    this._saveFiber = runClientUnscoped(debouncedSave);
  }

  protected override createRenderRoot() {
    return this;
  }

  override render() {
    const { note, blocks, status, error } = this.ctrl.model;
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
