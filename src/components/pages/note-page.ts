// src/components/pages/note-page.ts
import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit-html/directives/repeat.js"; // ✅ ADDED: Import the repeat directive
import { Effect, Schema, Fiber, Duration } from "effect";
import { runClientPromise, runClientUnscoped } from "../../lib/client/runtime";
import {
  ReplicacheService,
  type ReplicacheMutators,
} from "../../lib/client/replicache";
import styles from "./NotePage.module.css";
import {
  BlockSchema,
  NoteSchema,
  type Block,
  type Note,
  type NoteId,
} from "../../lib/shared/schemas";
import { clientLog } from "../../lib/client/clientLog";
import { Replicache } from "replicache";

type Status = "loading" | "idle" | "saving" | "error";

@customElement("note-page")
export class NotePage extends LitElement {
  // ... (properties and other methods remain the same)
  @property({ type: String })
  override id: string = "";

  @state() private _note: Note | null = null;
  @state() private _blocks: Block[] = [];
  @state() private _status: Status = "loading";
  @state() private _error: string | null = null;

  private _rep: Replicache<ReplicacheMutators> | undefined;
  private _unsubscribe: (() => void) | undefined;
  private _saveFiber: Fiber.RuntimeFiber<void, Error> | undefined;

  private readonly _connectedEffect = Effect.gen(
    function* (this: NotePage) {
      if (!this.id) {
        this._status = "error";
        this._error = "Note ID is missing.";
        return;
      }

      const replicache = yield* ReplicacheService;
      this._rep = replicache.client;

      const noteKey = `note/${this.id}`;

      this._unsubscribe = this._rep.subscribe(
        async (tx) => {
          const note = await tx.get(noteKey);
          const allBlocks = await tx
            .scan({ prefix: "block/" })
            .values()
            .toArray();
          return { note, allBlocks };
        },
        (result) => {
          if (!result.note) {
            this._status = "error";
            this._error = "Note not found.";
            return;
          }

          try {
            this._note = Schema.decodeUnknownSync(NoteSchema)(result.note);
            this._blocks = result.allBlocks
              .flatMap((b) => {
                try {
                  return [Schema.decodeUnknownSync(BlockSchema)(b)];
                } catch {
                  return [];
                }
              })
              .filter((b) => b.note_id === this.id)
              .sort((a, b) => a.order - b.order);

            this._status = "idle";
          } catch (e) {
            this._status = "error";
            this._error = "Failed to parse note data.";
            runClientUnscoped(
              clientLog("error", "[NotePage] Failed to decode note or blocks", {
                error: e,
              }),
            );
          }
        },
      );
    }.bind(this),
  );

  override connectedCallback() {
    super.connectedCallback();
    void runClientPromise(this._connectedEffect);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._unsubscribe?.();
    if (this._saveFiber) {
      runClientUnscoped(Fiber.interrupt(this._saveFiber));
    }
  }

  private _handleInput(update: Partial<Pick<Note, "title" | "content">>) {
    if (!this._note) return;
    this._note = { ...this._note, ...update };
    this._status = "saving";
    if (this._saveFiber) {
      runClientUnscoped(Fiber.interrupt(this._saveFiber));
    }

    const saveEffect = Effect.gen(
      function* (this: NotePage) {
        yield* Effect.sleep(Duration.millis(500));
        if (!this._rep || !this._note) return;
        yield* clientLog("info", `[NotePage] Saving note ${this.id}`);
        yield* Effect.promise(() =>
          this._rep!.mutate.updateNote({
            id: this.id as NoteId,
            title: this._note!.title,
            content: this._note!.content,
          }),
        );
        this._status = "idle";
      }.bind(this),
    ).pipe(
      Effect.catchAll((err) => {
        this._status = "error";
        this._error = "Failed to save note.";
        return clientLog(
          "error",
          `[NotePage] Save failed for note ${this.id}`,
          err,
        );
      }),
    );
    this._saveFiber = runClientUnscoped(saveEffect);
  }

  protected override createRenderRoot() {
    return this;
  }

  override render() {
    if (this._status === "loading") {
      return html`<div class=${styles.container}><p>Loading note...</p></div>`;
    }

    if (this._status === "error" || !this._note) {
      return html`<div class=${styles.container}>
        <p class=${styles.errorText}>
          ${this._error || "Note could not be loaded."}
        </p>
      </div>`;
    }

    const renderStatus = () => {
      if (this._status === "saving") return "Saving...";
      if (this._status === "error") return "Error saving";
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
            .value=${this._note.title}
            @input=${(e: Event) =>
              this._handleInput({
                title: (e.target as HTMLInputElement).value,
              })}
          />
          <textarea
            class=${styles.contentInput}
            .value=${this._note.content}
            @input=${(e: Event) =>
              this._handleInput({
                content: (e.target as HTMLTextAreaElement).value,
              })}
            placeholder="Start writing your note..."
          ></textarea>

          <div class=${styles.blocksContainer}>
            <h3 class=${styles.blocksHeader}>Parsed Blocks (Live Preview)</h3>
            ${this._blocks.length > 0
              ? repeat(
                  this._blocks,
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
