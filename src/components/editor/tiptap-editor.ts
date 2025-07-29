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

  public focusEditor() {
    this.editor?.chain().focus().run();
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
        // 🐞 DEBUG: Log when the editor itself triggers an update.
        console.log(
          "%c[tiptap-editor]%c onUpdate fired. Setting isInternallyUpdating = true and dispatching 'update' event.",
          "color: #F59E0B; font-weight: bold;",
          "color: inherit;",
        );
        this.isInternallyUpdating = true;

        this.dispatchEvent(
          new CustomEvent("update", {
            detail: {
              content: editor.getJSON(),
            },
          }),
        );

        // ✅ FIX: Defer resetting the flag until after the current synchronous
        // execution context, which includes the parent's re-render.
        setTimeout(() => {
          // 🐞 DEBUG: Log when the internal update flag is reset.
          console.log(
            "%c[tiptap-editor]%c Resetting isInternallyUpdating to false.",
            "color: #F59E0B; font-weight: bold;",
            "color: inherit;",
          );
          this.isInternallyUpdating = false;
        }, 0);
      },
    });
  }

  override updated(changedProperties: PropertyValues<this>) {
    // 🐞 DEBUG: Log every time the component's `updated` lifecycle runs.
    console.log(
      `%c[tiptap-editor]%c updated() lifecycle hook fired. isInternallyUpdating is ${this.isInternallyUpdating}.`,
      "color: #F59E0B; font-weight: bold;",
      "color: inherit;",
      { changedProperties: new Map(changedProperties) },
    );
    if (changedProperties.has("initialContent") && this.editor) {
      if (this.isInternallyUpdating) {
        // 🐞 DEBUG: Log when we are correctly ignoring an update.
        console.log(
          "%c[tiptap-editor]%c Ignoring update because it was triggered internally.",
          "color: #F59E0B; font-weight: bold;",
          "color: inherit;",
        );
        // ✅ FIX: With the setTimeout fix above, we no longer need to reset
        // the flag here. We simply ignore the update.
        return;
      }

      const isSame =
        JSON.stringify(this.editor.getJSON()) ===
        JSON.stringify(this.initialContent);

      // 🐞 DEBUG: Log whether the incoming content is the same as the editor's current content.
      console.log(
        `%c[tiptap-editor]%c Comparing incoming initialContent to editor content. Is same? ${isSame}.`,
        "color: #F59E0B; font-weight: bold;",
        "color: inherit;",
      );

      if (!isSame) {
        // 🐞 DEBUG: Log when we are about to overwrite the editor's content.
        console.log(
          "%c[tiptap-editor]%c Content is different. Calling setContent to overwrite editor state.",
          "color: #EF4444; font-weight: bold;",
          "color: inherit;",
        );
        this.editor.commands.setContent(this.initialContent, {
          emitUpdate: false, // Don't trigger another `onUpdate` for this change.
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
