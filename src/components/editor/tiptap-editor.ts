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

/* MARKDOWN CONVERSION HELPERS */

import { ProseMirrorUnified } from "prosemirror-unified";
import { MarkdownExtension } from "prosemirror-remark";
import type { TiptapDoc } from "../../lib/shared/schemas";

// Instantiate the processor once. It can be reused across function calls.
const pmu = new ProseMirrorUnified([new MarkdownExtension()]);

/**
 * Converts a Tiptap document (ProseMirror JSON) to a Markdown string
 * using the prosemirror-remark library for robust serialization.
 * @param doc The Tiptap document object.
 * @returns A Markdown string representation of the document.
 */
export const convertTiptapToMarkdown = (doc: TiptapDoc): string => {
  if (!doc || !doc.content || doc.content.length === 0) {
    return "";
  }
  const prosemirrorNode = pmu.schema().nodeFromJSON(doc);
  return pmu.serialize(prosemirrorNode);
};

/**
 * Converts a Markdown string into a Tiptap document (ProseMirror JSON)
 * using the prosemirror-remark library.
 * @param markdown The Markdown string to parse.
 * @returns A Tiptap document object.
 */
export const convertMarkdownToTiptap = (markdown: string): TiptapDoc => {
  const prosemirrorNode = pmu.parse(markdown);
  return prosemirrorNode.toJSON() as TiptapDoc;
};
