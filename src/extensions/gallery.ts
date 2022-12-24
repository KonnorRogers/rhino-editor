import { mergeAttributes, Node } from "@tiptap/core"
import { EditorState, Plugin, Transaction } from "prosemirror-state";
import { DOMSerializer, Node as ProseMirrorNode } from "prosemirror-model"

function handleGallery (node: ProseMirrorNode, tr: Transaction, newState: EditorState, pos: number) {
	let modified = false

  if (node.type.name != "attachment-gallery") return modified;

  if (node.nodeSize === 2) {
    tr.replaceWith(pos, pos + node.nodeSize, newState.schema.node("paragraph", null, []));
    modified = true;
  }

  return modified
}

function handleCaptions (node: ProseMirrorNode, tr: Transaction, newState: EditorState, pos: number) {
	let modified = false
  if (node.type.name !== "attachment-figure") return modified;

	// @see https://discuss.prosemirror.net/t/saving-content-containing-dom-generated-by-nodeview/2594/5
	let scratch = document.createElement("div")
	scratch.appendChild(DOMSerializer.fromSchema(newState.schema).serializeNode(node))

	const figcaption = scratch.querySelector("figcaption")

	if (figcaption == null) return modified

	const caption = figcaption.innerHTML
	if (node.attrs.caption !== caption) {
		tr.setNodeMarkup(pos, undefined, {
    	...node.attrs,
    	caption,
  	})
  	modified = true
  }

	return modified
}

export interface GalleryOptions {
  HTMLAttributes: Record<string, any>
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
            	handleCaptions(node, tr, newState, pos)
            ]

						const shouldModify = mutations.some((bool) => bool === true)

          	if (shouldModify) {
          		modified = true
          	}
          });

          if (modified) return tr;

          return undefined
        }
      }),
    ];
  },
});
