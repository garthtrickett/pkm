// FILE: ./src/components/editor/tiptap-editor.ts
import { LitElement, html, type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { MovableNodes } from "./extensions/MovableNodes";

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
          blockquote: false,
          codeBlock: false,
          heading: false,
          horizontalRule: false,
        }),
        MovableNodes,
      ],
      content: this.initialContent || {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Start typing here...",
              },
            ],
          },
        ],
      },
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

  override updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("initialContent") && this.editor) {
      const isSame =
        JSON.stringify(this.editor.getJSON()) ===
        JSON.stringify(this.initialContent);

      if (!isSame) {
        // The second argument must be an options object. We pass { emitUpdate: false }
        // to prevent this programmatic update from firing another `onUpdate` event,
        // which would cause an infinite loop.
        this.editor.commands.setContent(this.initialContent, {
          emitUpdate: false,
        });
      }
    }
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

/* MIGRATION HELPER */

import { type TiptapDoc, type TiptapNode } from "../../lib/shared/schemas";

/**
 * Recursively converts a Tiptap node to its Markdown representation.
 * @param node The Tiptap node to convert.
 * @param indent The current indentation string for nesting.
 * @returns The Markdown string for the node.
 */
const convertNodeToMarkdown = (node: TiptapNode, indent = ""): string => {
  // Use a switch statement for exhaustive type checking and proper type narrowing.
  switch (node.type) {
    case "text":
      return node.text ?? "";

    case "paragraph":
      // Paragraphs join their content (which are text nodes).
      return (
        (node.content
          ?.map((child) => convertNodeToMarkdown(child, indent))
          .join("") ?? "") + "\n"
      );

    case "bulletList":
      // Bullet lists join their content (list items).
      return (
        node.content
          ?.map((child) => convertNodeToMarkdown(child, indent))
          .join("") ?? ""
      );

    case "listItem": {
      // List items add a bullet and handle nested content.
      const itemContent =
        node.content
          ?.map((childNode) => {
            // Increase indentation ONLY for nested lists.
            const childIndent =
              childNode.type === "bulletList" ? indent + "  " : "";
            return convertNodeToMarkdown(childNode, childIndent);
          })
          .join("") ?? "";

      // Remove trailing newline from the paragraph to keep it on the same line as the bullet.
      return `${indent}- ${itemContent.replace(/\n$/, "")}\n`;
    }

    // Default case for any unhandled node types.
    default:
      return "";
  }
};

/**
 * Converts a full Tiptap document object into a Markdown string.
 * @param doc The Tiptap document object.
 * @returns A Markdown string representation.
 */
export const convertTiptapToMarkdown = (doc: TiptapDoc): string => {
  if (!doc.content) {
    return "";
  }
  // Process all top-level nodes and join them together.
  return doc.content.map((node) => convertNodeToMarkdown(node, "")).join("");
};
