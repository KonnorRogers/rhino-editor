import { mergeAttributes, Node } from "@tiptap/core";

export interface GalleryOptions {
  HTMLAttributes: Record<string, any>;
}

export const Gallery = Node.create({
  name: "attachment-gallery",
  group: "block",
  draggable: false,
  selectable: false,
  // content: "attachmentFigure+",
  isolating: true,
  // defining: true,


  parseHTML() {
    return [
      {
        tag: "div.attachment-gallery",
      },
    ];
  },

  renderHTML() {
    return ["div", mergeAttributes({}, { class: "attachment-gallery" }), 0];
  },
});
