import { Node, mergeAttributes } from "@tiptap/core";
import { findAttribute } from "./find-attribute";

export interface ImageOptions {
  HTMLAttributes: Record<string, any>;
}

export const Image = Node.create({
  name: "attachment-image",
  selectable: false,
  draggable: false,
  group: "block",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      src: {
        default: "",
        parseHTML: (element) => findAttribute(element, "url"),
      },
      height: {
        default: "",
        parseHTML: (element) => findAttribute(element, "height"),
      },
      width: {
        default: "",
        parseHTML: (element) => findAttribute(element, "width"),
      },
      attachmentId: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure[data-trix-attachment] img[src]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
    ];
  },
});
