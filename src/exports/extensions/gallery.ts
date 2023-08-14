import { mergeAttributes, Node } from "@tiptap/core";
import { EditorState, Plugin, Transaction } from "@tiptap/pm/state";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";


function handleGallery(
  node: ProseMirrorNode,
  tr: Transaction,
  newState: EditorState,
  pos: number,
) {
  let modified = false;

  if (node.type.name != "attachment-gallery") return modified;

  if (node.nodeSize === 2) {
    tr.replaceWith(
      pos,
      pos + node.nodeSize,
      newState.schema.node("paragraph", null, []),
    );
    modified = true;
  }

  return modified;
}

export interface GalleryOptions {
  HTMLAttributes: Record<string, any>;
}

export const Gallery = Node.create({
  name: "attachment-gallery",
  group: "block",
  draggable: false,
  selectable: false,
  content: "block*",

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

  addProseMirrorPlugins() {
    return [
      new Plugin({
        appendTransaction: (_transactions, _oldState, newState) => {
          const tr = newState.tr;
          let modified = false;

          // @TODO: Iterate through transactions instead of descendants (?).
          newState.doc.descendants((node, pos, _parent) => {
            const mutations = [
              handleGallery(node, tr, newState, pos),
            ];

            const shouldModify = mutations.some((bool) => bool === true);

            if (shouldModify) {
              modified = true;
            }
          });

          if (modified) return tr;

          return undefined;
        },
      }),
    ];
  },
});
