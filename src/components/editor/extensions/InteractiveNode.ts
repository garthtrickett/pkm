// FILE: src/components/editor/extensions/InteractiveNode.ts
import {
  Node,
  NodeViewRenderer,
  textblockTypeInputRule,
  type Attribute,
} from "@tiptap/core";
import { type Node as ProsemirrorNode } from "@tiptap/pm/model";
import { type EditorView } from "@tiptap/pm/view";
import { Plugin, PluginKey, TextSelection } from "@tiptap/pm/state";
import { ReplaceStep } from "@tiptap/pm/transform";
import { v4 as uuidv4 } from "uuid";

const TASK_INPUT_REGEX = /^\[\]\s$/;

// ✨ STEP 1: Define the shape of your attributes
interface InteractiveNodeAttributes {
  blockId: string | null;
  blockType: "text" | "task";
  fields: {
    is_complete?: boolean;
  };
}

// ✨ STEP 2: Create a specific ProseMirrorNode type with the typed attributes
type InteractiveProsemirrorNode = ProsemirrorNode & {
  attrs: InteractiveNodeAttributes;
};

class InteractiveBlockNodeView {
  public dom: HTMLElement;
  public contentDOM: HTMLElement;
  private checkbox: HTMLInputElement;
  private dragHandle: HTMLElement;

  constructor(
    // ✨ FIX: Use the specific node type for the class property
    private node: InteractiveProsemirrorNode,
    private view: EditorView,
    private getPos: () => number | undefined,
  ) {
    this.dom = document.createElement("div");
    this.dom.draggable = true;
    this.dom.classList.add(
      "task-node-view",
      "flex",
      "items-center",
      "gap-2",
      "py-1",
      "group",
    );
    this.dom.addEventListener("dragstart", this.handleDragStart);

    // ... (drag handle and other DOM creation remains the same)
    const dragHandleWrapper = document.createElement("div");
    dragHandleWrapper.classList.add(
      "group",
      "cursor-grab",
      "px-2",
      "flex",
      "items-center",
      "select-none",
    );
    this.dragHandle = document.createElement("div");
    this.dragHandle.classList.add(
      "flex-shrink-0",
      "opacity-0",
      "group-hover:opacity-50",
      "transition-opacity",
    );
    this.dragHandle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="1"></circle><circle cx="9" cy="5" r="1"></circle><circle cx="9" cy="19" r="1"></circle><circle cx="15" cy="12" r="1"></circle><circle cx="15" cy="5" r="1"></circle><circle cx="15" cy="19" r="1"></circle></svg>`;

    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";

    // ✅ No more errors here! `this.node.attrs` is now fully typed.
    this.checkbox.checked = this.node.attrs.fields?.is_complete ?? false;

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
    this.view.dom.dispatchEvent(new DragEvent("dragstart", event));
  };

  private handleCheckboxChange = () => {
    this.dom.dispatchEvent(
      new CustomEvent("update-task-status", {
        bubbles: true,
        composed: true,
        detail: {
          // ✅ This access is now type-safe
          blockId: this.node.attrs.blockId,
          isComplete: this.checkbox.checked,
        },
      }),
    );
  };

  update(node: ProsemirrorNode): boolean {
    if (node.type.name !== this.node.type.name) {
      return false;
    }
    // ✨ FIX: Assert the incoming generic node to our specific type before assigning it
    this.node = node as InteractiveProsemirrorNode;

    // ✅ This access is now type-safe
    this.checkbox.checked = this.node.attrs.fields?.is_complete ?? false;
    return true;
  }

  destroy() {
    this.checkbox.removeEventListener("change", this.handleCheckboxChange);
    this.dom.removeEventListener("dragstart", this.handleDragStart);
  }
}

export const InteractiveNode = Node.create<{
  attributes: InteractiveNodeAttributes;
}>({
  name: "interactiveBlock",
  group: "block",
  content: "inline*",
  draggable: true,

  addAttributes(): { [key in keyof InteractiveNodeAttributes]: Attribute } {
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
    return ({ node, view, getPos }) => {
      // ✨ FIX: Assert that the node passed by Tiptap matches our specific type
      return new InteractiveBlockNodeView(
        node as InteractiveProsemirrorNode,
        view,
        getPos,
      );
    };
  },

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: TASK_INPUT_REGEX,
        type: this.type,
        getAttributes: (): InteractiveNodeAttributes => ({
          blockId: uuidv4(),
          blockType: "task",
          fields: {
            is_complete: false,
          },
        }),
      }),
    ];
  },

  addKeyboardShortcuts() {
    return {
      // ... (Keyboard shortcuts remain the same)
      Enter: () => {
        const { state } = this.editor;
        const { selection } = state;
        const { $from, empty } = selection;

        if (!empty || $from.parent.content.size !== $from.parentOffset) {
          return false;
        }

        if ($from.parent.type.name !== this.type.name) {
          return false;
        }

        if ($from.parent.content.size === 0) {
          return this.editor
            .chain()
            .focus()
            .clearNodes()
            .insertContent("<p></p>")
            .run();
        }

        return this.editor.commands.insertContentAt($from.after(), {
          type: this.type.name,
          attrs: {
            blockId: uuidv4(),
            blockType: "task",
            fields: { is_complete: false },
          } as InteractiveNodeAttributes,
        });
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      // ... (Plugin remains the same)
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
          let droppedNode: ProsemirrorNode | null | undefined = null;

          for (const step of dropTransaction.steps) {
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
            const endOfNodeContentPos = dropPos + 1 + droppedNode.content.size;

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
