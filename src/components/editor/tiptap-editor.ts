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
          hardBreak: false,
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

const convertNodeToMarkdown = (node: TiptapNode, indent = ""): string => {
  switch (node.type) {
    case "text":
      return node.text ?? "";

    case "heading": {
      const level = node.attrs?.level || 1;
      const prefix = "#".repeat(level);
      const text =
        node.content
          ?.map((child) => convertNodeToMarkdown(child, indent))
          .join("") ?? "";
      return `${prefix} ${text}`;
    }

    case "paragraph":
      return (
        node.content
          ?.map((child) => convertNodeToMarkdown(child, indent))
          .join("") ?? ""
      );

    case "bulletList":
      return (
        node.content
          ?.map((child) => convertNodeToMarkdown(child, indent))
          .join("\n") ?? ""
      );

    case "listItem": {
      const itemContent =
        node.content
          ?.map((childNode) => {
            const childIndent =
              childNode.type === "bulletList" ? indent + "  " : "";
            return convertNodeToMarkdown(childNode, childIndent);
          })
          .join("") ?? "";
      return `${indent}- ${itemContent}`;
    }

    default:
      return "";
  }
};

export const convertTiptapToMarkdown = (doc: TiptapDoc): string => {
  if (!doc.content || doc.content.length === 0) {
    return "";
  }

  // ✅ THIS IS THE FIX ✅
  // Join each block with two newlines, and add a final trailing newline
  // to ensure the parser always has the correct block separation context.
  const markdown =
    doc.content.map((node) => convertNodeToMarkdown(node, "")).join("\n\n") +
    "\n";

  return markdown;
};
