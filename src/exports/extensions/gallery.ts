import { mergeAttributes, Node, selectionToInsertionEnd } from "@tiptap/core";
import { EditorState, Plugin, Transaction } from "prosemirror-state";
import {
  chainCommands,
  createParagraphNear,
  // liftEmptyBlock,
  // newlineInCode,
  // selectNodeForward,
} from "prosemirror-commands";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { findParentNodeOfTypeClosestToPos } from "prosemirror-utils";
import { figureTypes } from "./attachment";

function replaceEmptyGalleryWithParagraph(
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
  content: "(paragraph | previewableAttachmentFigure)*",

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
        props: {
          handleDOMEvents: {
            keydown: (view, event) => {
              if (event.key === "Enter") {
                const nodeType = view.state.selection.$head.parent.type.name;
                if (nodeType === "attachment-gallery") {
                  event.preventDefault();

                  chainCommands(createParagraphNear)(view.state, view.dispatch);
                  return true;
                }

                if (figureTypes.includes(nodeType)) {
                  event.preventDefault();

                  chainCommands(createParagraphNear)(view.state, view.dispatch);

                  const containingGallery = findParentNodeOfTypeClosestToPos(
                    view.state.selection.$anchor,
                    view.state.schema.nodes["attachment-gallery"],
                  );

                  // TODO: Right now this just prevents us from splitting a gallery / figure.
                  // Ideally, we should check `nodesBetween` and any `figures` get placed into a new gallery under the inserted paragraph like Trix does.
                  if (containingGallery) {
                    const tr = view.state.tr;
                    tr.insert(
                      containingGallery.pos + containingGallery.node.nodeSize,
                      view.state.schema.nodes["paragraph"].create(),
                    );
                    selectionToInsertionEnd(tr, tr.steps.length - 1, -1);

                    view.dispatch(tr);
                  }
                  return true;
                }
              }

              return false;
            },
          },
        },
        appendTransaction: (_transactions, _oldState, newState) => {
          const tr = newState.tr;
          let modified = false;

          // @TODO: Iterate through transactions instead of descendants (?).
          newState.doc.descendants((node, pos, _parent) => {
            const mutations = [
              replaceEmptyGalleryWithParagraph(node, tr, newState, pos),
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
