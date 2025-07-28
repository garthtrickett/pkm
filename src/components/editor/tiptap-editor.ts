// FILE: ./src/components/editor/tiptap-editor.ts
import { LitElement, html, type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Editor, type JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { generateHTML, generateJSON } from "@tiptap/html";
import TurndownService from "turndown";
import { marked } from "marked";
import { MovableNodes } from "./extensions/MovableNodes";
import type { TiptapDoc } from "../../lib/shared/schemas";
import { InteractiveNode } from "./extensions/InteractiveNode";
import { TagMark } from "./extensions/TagMark";
import { LinkMark } from "./extensions/LinkMark";

@customElement("tiptap-editor")
export class TiptapEditor extends LitElement {
  @property({ type: String })
  initialContent: string | object = "";

  private editor?: Editor;
  private isInternallyUpdating = false;

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
        InteractiveNode,
        TagMark,
        LinkMark,
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
        // --- DEBUG LOG ---
        console.log(
          "[TiptapEditor onUpdate] Editor content changed. Setting isInternallyUpdating = true and dispatching 'update' event.",
        );
        this.isInternallyUpdating = true;
        this.dispatchEvent(
          new CustomEvent("update", {
            detail: {
              content: editor.getJSON(),
            },
          }),
        );
        Promise.resolve().then(() => {
          // --- DEBUG LOG ---
          console.log(
            "[TiptapEditor onUpdate] Resetting isInternallyUpdating = false.",
          );
          this.isInternallyUpdating = false;
        });
      },
    });
  }

  override updated(changedProperties: PropertyValues<this>) {
    if (changedProperties.has("initialContent") && this.editor) {
      // --- DEBUG LOG ---
      console.log(
        `[TiptapEditor updated] 'initialContent' property changed. isInternallyUpdating: ${this.isInternallyUpdating}`,
      );

      if (this.isInternallyUpdating) {
        // --- DEBUG LOG ---
        console.log(
          "[TiptapEditor updated] Update was internal. Bypassing setContent to prevent feedback loop.",
        );
        return;
      }

      const isSame =
        JSON.stringify(this.editor.getJSON()) ===
        JSON.stringify(this.initialContent);

      if (!isSame) {
        // --- DEBUG LOG ---
        console.log(
          "[TiptapEditor updated] External content is different. Calling editor.commands.setContent().",
        );
        this.editor.commands.setContent(this.initialContent, {
          emitUpdate: false,
        });
      } else {
        // --- DEBUG LOG ---
        console.log(
          "[TiptapEditor updated] External content is the same. No-op.",
        );
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

const turndownService = new TurndownService();
const extensions = [
  StarterKit.configure({
    hardBreak: false,
  }),
  InteractiveNode,
  TagMark,
  LinkMark,
];

export const convertTiptapToMarkdown = (doc: TiptapDoc): string => {
  if (!doc || !doc.content || doc.content.length === 0) {
    return "";
  }
  try {
    const mutableDoc = JSON.parse(JSON.stringify(doc)) as JSONContent;
    const html = generateHTML(mutableDoc, extensions);
    const markdown = turndownService.turndown(html);
    return markdown;
  } catch (error) {
    console.error(
      "[convertTiptapToMarkdown] CRITICAL: Failed to convert Tiptap JSON to Markdown via HTML.",
      error,
    );
    return "--- ERROR DURING MARKDOWN CONVERSION ---";
  }
};

export const convertMarkdownToTiptap = (markdown: string): TiptapDoc => {
  try {
    const html = marked.parse(markdown, { async: false });
    const doc = generateJSON(html, extensions) as TiptapDoc;
    return doc;
  } catch (error) {
    console.error(
      "[convertMarkdownToTiptap] CRITICAL: Failed to parse Markdown string via HTML.",
      error,
    );
    return {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Error parsing Markdown." }],
        },
      ],
    };
  }
};
