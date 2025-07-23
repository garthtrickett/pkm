// FILE: ./src/components/editor/tiptap-editor.ts
import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Editor, InputRule } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Node } from "@tiptap/core";

// 1. DEFINE A CUSTOM BLOCK NODE
const BlockNode = Node.create({
  name: "blockNode",
  group: "block",
  content: "paragraph",

  addAttributes() {
    return {
      depth: {
        default: 0,
      },
      listType: {
        default: null,
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    // We now use padding instead of margin for better visual alignment with the cursor.
    return [
      "div",
      {
        "data-type": "block-node",
        "data-depth": HTMLAttributes.depth,
        "data-list-type": HTMLAttributes.listType,
        style: `padding-left: ${HTMLAttributes.depth * 24}px;`,
      },
      0,
    ];
  },

  addInputRules() {
    return [
      new InputRule({
        find: /^\s*([-*])\s$/,
        // This is the new fix. Instead of the general .focus(), we explicitly
        // set the text selection to the start of the range that was just
        // deleted. This is a more direct and reliable way to control the
        // cursor position and avoid the rendering race condition.
        handler: ({ chain, range }) => {
          chain()
            .deleteRange(range)
            .updateAttributes("blockNode", { listType: "bullet" })
            .setTextSelection(range.from) // <-- The new, more explicit fix
            .run();
        },
      }),
    ];
  },
});

@customElement("tiptap-editor")
export class TiptapEditor extends LitElement {
  @property({ type: String })
  initialContent: string | object = "";

  private editor?: Editor;

  public getContent() {
    return this.editor?.getJSON();
  }

  override firstUpdated() {
    this.editor = new Editor({
      element: this,
      extensions: [
        StarterKit.configure({
          document: false,
          hardBreak: false,
        }),
        Node.create({
          name: "doc",
          topNode: true,
          content: "blockNode+",
        }),
        BlockNode,
        Node.create({
          name: "customKeymap",
          addKeyboardShortcuts() {
            return {
              Enter: () => {
                const { from } = this.editor.state.selection;
                const $from = this.editor.state.doc.resolve(from);
                const currentBlock = $from.node(-1); // Get the parent blockNode
                const currentAttrs = currentBlock.attrs;

                // Create a new block with the same attributes (depth, listType)
                // as the current one.
                return (
                  this.editor
                    .chain()
                    .insertContentAt(this.editor.state.selection.head, {
                      type: "blockNode",
                      attrs: {
                        depth: currentAttrs.depth,
                        listType: currentAttrs.listType,
                      },
                      content: [
                        {
                          type: "paragraph",
                        },
                      ],
                    })
                    // This is the key change for the cursor: it moves the cursor
                    // to the start of the newly created node's content.
                    .setTextSelection(this.editor.state.selection.head + 2)
                    .run()
                );
              },
              Backspace: () => {
                const { from, empty } = this.editor.state.selection;
                if (!empty) return false;

                const $from = this.editor.state.doc.resolve(from);
                const node = $from.node(-1);

                if ($from.parentOffset === 0 && node.attrs.listType) {
                  return this.editor.commands.command(({ tr }) => {
                    tr.setNodeMarkup($from.before(-1), undefined, {
                      ...node.attrs,
                      listType: null,
                    });
                    return true;
                  });
                }

                return false;
              },
              Tab: () => {
                return this.editor.commands.command(({ tr, state }) => {
                  const { from } = state.selection;
                  state.doc.nodesBetween(from, from, (node, pos) => {
                    if (node.type.name === "blockNode") {
                      const currentDepth = node.attrs.depth;
                      tr.setNodeMarkup(pos, undefined, {
                        ...node.attrs,
                        depth: currentDepth + 1,
                      });
                      return false;
                    }
                  });
                  return true;
                });
              },
              "Shift-Tab": () => {
                return this.editor.commands.command(({ tr, state }) => {
                  const { from } = state.selection;
                  state.doc.nodesBetween(from, from, (node, pos) => {
                    if (node.type.name === "blockNode") {
                      const currentDepth = node.attrs.depth;
                      if (currentDepth > 0) {
                        tr.setNodeMarkup(pos, undefined, {
                          ...node.attrs,
                          depth: currentDepth - 1,
                        });
                      }
                      return false;
                    }
                  });
                  return true;
                });
              },
            };
          },
        }),
      ],
      content:
        this.initialContent ||
        `<div data-type="block-node" data-depth="0"><p></p></div>`,
      editorProps: {
        attributes: {
          class: "prose prose-zinc focus:outline-none max-w-full",
        },
      },
      onUpdate: ({ editor }) => {
        this.dispatchEvent(
          new CustomEvent("update", {
            detail: {
              content: editor.getJSON(),
            },
          }),
        );
      },
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.editor?.destroy();
  }

  override render() {
    return html``;
  }

  protected override createRenderRoot() {
    return this;
  }
}
