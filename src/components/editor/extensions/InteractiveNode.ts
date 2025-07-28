// FILE: src/components/editor/extensions/InteractiveNode.ts
import { Node, NodeViewRenderer, textblockTypeInputRule } from "@tiptap/core";
import type { Node as ProsemirrorNode } from "@tiptap/pm/model";
import {
  Plugin,
  PluginKey,
  NodeSelection,
  Transaction,
  TextSelection,
} from "@tiptap/pm/state";
import { Step, ReplaceStep } from "@tiptap/pm/transform";
import { v4 as uuidv4 } from "uuid";

const TASK_INPUT_REGEX = /^\[\]\s$/;

class InteractiveBlockNodeView {
  public dom: HTMLElement;
  public contentDOM: HTMLElement;
  private checkbox: HTMLInputElement;
  private dragHandle: HTMLElement;

  constructor(
    private node: ProsemirrorNode,
    private view: any,
    private getPos: () => number | undefined,
  ) {
    // --- DEBUG LOG ---

    this.dom = document.createElement("div");
    this.dom.draggable = true;
    this.dom.classList.add(
      "task-node-view",
      "flex",
      "items-center",
      "gap-2",
      "py-1",
      "px-2",
      "group",
    );
    this.dom.addEventListener("dragstart", this.handleDragStart);

    // This wrapper creates a larger, invisible grab area around the handle.
    const dragHandleWrapper = document.createElement("div");
    dragHandleWrapper.classList.add(
      "group", // Renamed the outer div to not be the group for hover
      "cursor-grab",
      "flex",
      "items-center",
      "select-none",
    );

    this.dragHandle = document.createElement("div"); // The visible handle icon
    this.dragHandle.classList.add(
      "flex-shrink-0",
      "opacity-0",
      "group-hover:opacity-50", // Now responds to hover on the wrapper
      "transition-opacity",
    );
    this.dragHandle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>`;

    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    this.checkbox.checked = this.node.attrs.fields.is_complete;
    this.checkbox.classList.add(
      "h-4",
      "w-4",
      "flex-shrink-0",
      "cursor-pointer",
      "rounded",
      "border-zinc-300",
      "text-zinc-600",
      "focus:ring-zinc-500",
    );
    this.checkbox.addEventListener("change", this.handleCheckboxChange);

    this.contentDOM = document.createElement("div");
    this.contentDOM.classList.add("flex-1");

    dragHandleWrapper.appendChild(this.dragHandle);
    this.dom.append(dragHandleWrapper, this.checkbox, this.contentDOM);
  }

  private handleDragStart = (event: DragEvent) => {
    // --- DEBUG LOG ---
    this.view.dom.dispatchEvent(new DragEvent("dragstart", event));
  };

  private handleCheckboxChange = () => {
    this.dom.dispatchEvent(
      new CustomEvent("update-task-status", {
        bubbles: true,
        composed: true,
        detail: {
          blockId: this.node.attrs.blockId,
          isComplete: this.checkbox.checked,
        },
      }),
    );
  };

  update(node: ProsemirrorNode): boolean {
    this.node = node;
    this.checkbox.checked = this.node.attrs.fields.is_complete;
    return true;
  }

  destroy() {
    // --- DEBUG LOG ---
    this.checkbox.removeEventListener("change", this.handleCheckboxChange);
    this.dom.removeEventListener("dragstart", this.handleDragStart);
  }
}

export const InteractiveNode = Node.create({
  name: "interactiveBlock",
  group: "block",
  content: "inline*",
  draggable: true,

  addAttributes() {
    return {
      blockId: { default: null },
      blockType: { default: "text" },
      fields: { default: {} },
    };
  },

  parseHTML() {
    return [{ tag: `div[data-interactive-block][data-type="task"]` }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      { ...HTMLAttributes, "data-interactive-block": "", "data-type": "task" },
      0,
    ];
  },

  addNodeView(): NodeViewRenderer {
    return (props) =>
      new InteractiveBlockNodeView(props.node, props.view, props.getPos);
  },

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: TASK_INPUT_REGEX,
        type: this.type,
        getAttributes: () => ({
          blockId: uuidv4(),
          blockType: "task",
          fields: {
            is_complete: false,
          },
        }),
      }),
    ];
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("interactiveNodeDropHandler"),
        appendTransaction: (transactions, _oldState, newState) => {
          const dropTransaction = transactions.find(
            (tr) => tr.getMeta("uiEvent") === "drop" && tr.docChanged,
          );

          if (!dropTransaction) {
            return null;
          }

          let dropPos = -1;
          let droppedNode: ProsemirrorNode | null = null;

          for (const step of dropTransaction.steps as Step[]) {
            if (
              step instanceof ReplaceStep &&
              step.slice.size > 0 &&
              step.slice.content.firstChild?.type.name === this.type.name
            ) {
              dropPos = step.from;
              droppedNode = step.slice.content.firstChild;
              break;
            }
          }

          if (dropPos !== -1 && droppedNode) {
            // --- THIS IS THE FIX ---

            // 2. Instead of a NodeSelection, calculate the position for a TextSelection
            //    at the end of the content within the dropped node.
            //    `dropPos` is the start of the node.
            //    `+ 1` moves inside the node.
            //    `+ droppedNode.content.size` moves to the end of the node's content.
            const endOfNodeContentPos = dropPos + 1 + droppedNode.content.size;

            // 3. Create and return a new transaction that sets a TextSelection.
            //    This places the cursor naturally and avoids the stale "NodeSelection" state.
            return newState.tr.setSelection(
              TextSelection.create(newState.doc, endOfNodeContentPos),
            );
          }
          return null;
        },
      }),
    ];
  },
});
