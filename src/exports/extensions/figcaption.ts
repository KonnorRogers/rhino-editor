import { Node, mergeAttributes } from "@tiptap/core";

export interface FigcaptionOptions {
  HTMLAttributes: Record<string, any>;
}

export const Figcaption = Node.create({
  name: "attachment-figcaption",
  group: "block figcaption",
  content: "inline*",
  selectable: false,
  draggable: false,
  defining: true,
  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: { class: "attachment__caption attachment--edited" },
    };
  },

  parseHTML() {
    return [
      {
        tag: `figure[data-trix-attachment] figcaption`,
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "figcaption",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});
