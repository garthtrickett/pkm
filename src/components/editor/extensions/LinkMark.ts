// FILE: src/components/editor/extensions/LinkMark.ts
import { Mark, markInputRule, markPasteRule } from "@tiptap/core";

export const WIKI_LINK_INPUT_REGEX = /\[\[([^[\]]+)]]$/;
export const WIKI_LINK_PASTE_REGEX = /\[\[([^[\]]+)]]/g;

/**
 * A Tiptap Mark extension for rendering inline wiki-links like [[My Note]]
 * as styled, interactive elements.
 */
export const LinkMark = Mark.create({
  name: "linkMark",

  // Link marks should not overlap with other marks like bold or tags.
  excludes: "_",

  // Defines the attributes for this mark. We'll store the link target here.
  addAttributes() {
    return {
      linkTarget: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-link-target"),
        // By typing `attributes` here, we fix the `any` inference.
        renderHTML: (attributes: { linkTarget: string | null }) => ({
          "data-link-target": attributes.linkTarget,
        }),
      },
    };
  },

  // Defines how this mark is parsed from HTML.
  parseHTML() {
    return [
      {
        // Use an `<a>` tag for semantic correctness.
        tag: "a[data-link-target]",
      },
    ];
  },

  // Defines how this mark is rendered into HTML.
  renderHTML({ HTMLAttributes }) {
    // We render it as an `<a>` tag with a default href to make it behave like a link.
    // The click event will be handled by the parent editor component.
    return ["a", { ...HTMLAttributes, href: "#" }, 0];
  },

  // Automatically applies the mark when the user types the wiki-link pattern.
  addInputRules() {
    return [
      markInputRule({
        find: WIKI_LINK_INPUT_REGEX,
        type: this.type,
        getAttributes: (match) => ({ linkTarget: match[1] }),
      }),
    ];
  },

  // Applies the mark to any matching patterns when text is pasted.
  addPasteRules() {
    return [
      markPasteRule({
        find: WIKI_LINK_PASTE_REGEX,
        type: this.type,
        getAttributes: (match) => ({ linkTarget: match[1] }),
      }),
    ];
  },
});
