import { Node, NodeViewRenderer, textblockTypeInputRule } from "@tiptap/core";
import type { Node as ProsemirrorNode } from "@tiptap/pm/model";
// ✅ 1. IMPORT the UUID generator instead of nanoid.
import { v4 as uuidv4 } from "uuid";

const TASK_INPUT_REGEX = /^\[\]\s$/;

class InteractiveBlockNodeView {
  public dom: HTMLElement;
  public contentDOM: HTMLElement;
  private checkbox: HTMLInputElement;

  constructor(
    private node: ProsemirrorNode,
    private view: any,
    private getPos: () => number | undefined,
  ) {
    // The main container for the node view
    this.dom = document.createElement("div");
    this.dom.classList.add(
      "task-node-view",
      "flex",
      "items-start",
      "gap-2",
      "py-1",
    );

    // The checkbox element (the "chrome")
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
      "mt-1",
    );
    this.checkbox.addEventListener("change", this.handleCheckboxChange);

    // The container for the editable content
    this.contentDOM = document.createElement("div");
    this.contentDOM.classList.add("flex-1");

    this.dom.append(this.checkbox, this.contentDOM);
  }

  // Dispatch the custom event when the checkbox is clicked
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

  // Update the checkbox if the node's data changes from an external source
  update(node: ProsemirrorNode): boolean {
    if (node.type.name !== this.node.type.name) {
      return false;
    }
    this.node = node;
    this.checkbox.checked = this.node.attrs.fields.is_complete;
    return true;
  }

  // Clean up the event listener
  destroy() {
    this.checkbox.removeEventListener("change", this.handleCheckboxChange);
  }
}

export const InteractiveNode = Node.create({
  name: "interactiveBlock",
  group: "block",
  content: "inline*",

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
          // ✅ 2. USE the UUID generator to create a valid ID.
          blockId: uuidv4(),
          blockType: "task",
          fields: {
            is_complete: false,
          },
        }),
      }),
    ];
  },
});
