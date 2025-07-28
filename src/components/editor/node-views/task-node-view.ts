// FILE: src/components/editor/node-views/task-node-view.ts
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("task-node-view")
export class TaskNodeView extends LitElement {
  /** The unique ID of the block this component represents. */
  @property({ type: String })
  blockId: string = "";

  /** The text content of the task. */
  @property({ type: String })
  content: string = "";

  /** The completion state of the task. */
  @property({ type: Boolean })
  isComplete: boolean = false;

  /**
   * Handles the change event from the checkbox.
   * It dispatches a custom event with the necessary details to update the task's state.
   */
  private _onCheckboxChange(e: Event) {
    const isChecked = (e.target as HTMLInputElement).checked;
    this.dispatchEvent(
      new CustomEvent("update-task-status", {
        bubbles: true, // Allows the event to bubble up through the DOM
        composed: true, // Allows the event to cross Shadow DOM boundaries
        detail: {
          blockId: this.blockId,
          isComplete: isChecked,
        },
      }),
    );
  }

  override render() {
    return html`
      <div class="task-node-view flex items-center gap-2 py-1">
        <input
          type="checkbox"
          .checked=${this.isComplete}
          @change=${this._onCheckboxChange}
          class="h-4 w-4 flex-shrink-0 cursor-pointer rounded border-zinc-300 text-zinc-600 focus:ring-zinc-500"
        />
        <span
          class="${this.isComplete
            ? "text-zinc-400 line-through"
            : "text-zinc-800"} flex-1"
          >${this.content}</span
        >
      </div>
    `;
  }

  /** Render directly into the host element's light DOM to allow global styles. */
  protected override createRenderRoot() {
    return this;
  }
}
