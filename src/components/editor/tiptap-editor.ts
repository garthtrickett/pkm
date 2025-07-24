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
        // ✅ THIS IS THE FIX ✅
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

const convertNodeToMarkdown = (node: TiptapNode, indent = ""): string => {
  let text = "";

  if (node.type === "text") {
    text += node.text;
  }

  if ("content" in node && node.content) {
    if (node.type === "listItem") {
      text += `${indent}- ${node.content
        .map((n) => convertNodeToMarkdown(n, "  "))
        .join("")}\n`;
    } else {
      text += node.content
        .map((n) => convertNodeToMarkdown(n, indent))
        .join("");
    }
  }
  return text;
};

export const convertTiptapToMarkdown = (doc: TiptapDoc): string => {
  return (
    doc.content?.map((node) => convertNodeToMarkdown(node)).join("\n") ?? ""
  );
};
