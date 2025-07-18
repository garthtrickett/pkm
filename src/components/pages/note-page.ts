// FILE: ./src/components/pages/note-page.ts
import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit-html/directives/repeat.js";
import { Effect, Schema, Fiber, Duration } from "effect";
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
import { ReplicacheLive } from "../../lib/client/replicache";

type Status = "loading" | "idle" | "saving" | "error";

@customElement("note-page")
export class NotePage extends LitElement {
  @property({ type: String })
  override id: string = "";

  @state() private _note: Note | null = null;
  @state() private _blocks: Block[] = [];
  @state() private _status: Status = "loading";
  @state() private _error: string | null = null;

  // ✅ FIX: Add a flag to prevent re-initialization.
  @state() private _isInitialized = false;

  private _replicacheUnsubscribe: (() => void) | undefined;
  // ✅ FIX: Rename to be more specific.
  private _authUnsubscribe: (() => void) | undefined;
  private _saveFiber: Fiber.RuntimeFiber<void, unknown> | undefined;

  private _initializeState() {
    this._replicacheUnsubscribe?.();

    const setupEffect = Effect.gen(
      function* (this: NotePage) {
        if (!this.id) {
          this._status = "error";
          this._error = "Note ID is missing.";
          return;
        }
        this._status = "loading";
        yield* clientLog("info", `[NotePage] Initializing with ID: ${this.id}`);

        const replicache = yield* ReplicacheService;
        const noteKey = `note/${this.id}`;

        this._replicacheUnsubscribe = replicache.client.subscribe(
          async (tx) => {
            const note = await tx.get(noteKey);
            const allBlocks = await tx
              .scan({ prefix: "block/" })
              .values()
              .toArray();
            return { note, allBlocks };
          },
          (result) => {
            if (this._status === "saving") return;

            if (!result.note) {
              this._status = "error";
              this._error = "Note not found.";
              return;
            }

            try {
              this._note = Schema.decodeUnknownSync(NoteSchema)(result.note);
              this._blocks = result.allBlocks
                .flatMap((b) =>
                  Schema.decodeUnknownOption(BlockSchema)(b).pipe((o) =>
                    o._tag === "Some" ? [o.value] : [],
                  ),
                )
                .filter((b) => b.note_id === this.id)
                .sort((a, b) => a.order - b.order);
              this._status = "idle";
            } catch (e) {
              this._status = "error";
              this._error = "Failed to parse note data.";
              runClientUnscoped(
                clientLog("error", "Failed to decode data", { error: e }),
              );
            }
          },
        );
      }.bind(this),
    );

    void runClientPromise(setupEffect);
  }

  // ✅ FIX: Implement a robust connectedCallback that subscribes to auth state.
  override connectedCallback() {
    super.connectedCallback();
    const handleAuthChange = (auth: AuthModel) => {
      if (auth.status === "authenticated" && !this._isInitialized) {
        this._isInitialized = true;
        this._initializeState();
      } else if (auth.status !== "authenticated" && this._isInitialized) {
        // Reset component state if user logs out
        this._isInitialized = false;
        this._replicacheUnsubscribe?.();
        this._note = null;
        this._status = "loading";
      }
    };

    this._authUnsubscribe = authState.subscribe(handleAuthChange);
    // Immediately check the current state upon connection
    handleAuthChange(authState.value);
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);
    if (changedProperties.has("id") && this.id && this._isInitialized) {
      // Re-initialize if the note ID changes and we are already authenticated
      this._initializeState();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._replicacheUnsubscribe?.();
    // ✅ FIX: Unsubscribe from the auth store to prevent memory leaks.
    this._authUnsubscribe?.();
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
        const replicache = yield* ReplicacheService;
        if (!this._note) return;

        yield* Effect.promise(() =>
          replicache.client.mutate.updateNote({
            id: this.id as NoteId,
            title: this._note!.title,
            content: this._note!.content,
          }),
        );
      }.bind(this),
    ).pipe(
      Effect.tap(() =>
        Effect.sync(() => {
          this._status = "idle";
        }),
      ),
      Effect.catchAll((err) => {
        this._status = "error";
        this._error = "Failed to save note.";
        return clientLog("error", `Save failed for note ${this.id}`, err);
      }),
    );

    const currentUser = authState.value.user;
    if (!currentUser) {
      this._status = "error";
      this._error = "Cannot save: Not authenticated.";
      runClientUnscoped(
        clientLog("error", "[NotePage] Save failed: no authenticated user."),
      );
      return;
    }

    const replicacheLayer = ReplicacheLive(currentUser);
    const runnableEffect = Effect.provide(saveEffect, replicacheLayer);

    this._saveFiber = runClientUnscoped(runnableEffect);
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
