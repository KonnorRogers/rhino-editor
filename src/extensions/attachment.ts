import { AttachmentManager } from "src/models/attachment-manager";
import type { AttachmentEditor } from "src/elements/attachment-editor";
import { Plugin } from "prosemirror-state";
import { mergeAttributes, Node } from "@tiptap/core";
import { Extension } from "@tiptap/core";
import { selectionToInsertionEnd } from "@tiptap/core/src/helpers/selectionToInsertionEnd";


export interface AttachmentOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    attachment: {
      /**
       * Add an attachment(s)
       */
      setAttachment: (
        options: AttachmentManager | AttachmentManager[]
      ) => ReturnType;
    };
  }
}

function findAttribute(element: HTMLElement, attribute: string) {
  const attr = element
    .closest("action-text-attachment")
    ?.getAttribute(attribute);
  if (attr) return attr;

  const attrs = element
    .closest("figure.attachment")
    ?.getAttribute("data-trix-attachment");
  if (!attrs) return null;

  return JSON.parse(attrs)[attribute];
}

export interface ImageOptions {
  HTMLAttributes: Record<string, any>;
}
const AttachmentImage = Node.create({
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
        tag: "img[src]",
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

const AttachmentGallery = Node.create({
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

          // TO-DO: Iterate through transactions instead of descendants (?).
          newState.doc.descendants((node, pos, _parent) => {
            if (node.type.name != "attachment-gallery") return;


						// console.log(node)
						// console.log(node.nodeSize)
            if (node.nodeSize === 2) {
            	console.log("Trying to replace: ", node.type.name, pos, node.nodeSize);
            	tr.replaceWith(pos, pos + node.nodeSize, newState.schema.node("paragraph", null, []));
            	modified = true;
            }
          });

          if (modified) return tr;

          return undefined
        }
      }),
    ];
  },
});

/** https://github.com/basecamp/trix/blob/main/src/trix/models/attachment.coffee#L4 */
// const isPreviewable = /^image(\/(gif|png|jpe?g)|$)/

const Attachment = Node.create({
  name: "attachment-figure",
  group: "block attachmentFigure",
  content: "inline*",
  selectable: true,
  draggable: true,
  isolating: true,
  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: "attachment attachment--preview attachment--png",
        "data-trix-attributes": JSON.stringify({ presentation: "gallery" }),
      },
    };
  },

  parseHTML() {
    return [
      // {
      //   tag: "action-text-attachment",
      // },
      {
        tag: "figure",
      },
    ];
  },

  renderHTML({ node }) {
    const {
      // Figure
      content,
      contentType,
      sgid,
      fileName,
      fileSize,
      caption,
      url,

      // Image
      // src,
      width,
      height,
    } = node.attrs;

    const attachmentAttrs: Record<keyof typeof node.attrs, string> = {
      contentType,
      content,
      filename: fileName,
      filesize: fileSize,
      height,
      width,
      sgid,
      url,
    };

    const figure = [
      "figure",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-trix-content-type": contentType,
        "data-trix-attachment": JSON.stringify(attachmentAttrs),
        "data-trix-attributes": JSON.stringify({
          caption,
          presentation: "gallery",
        }),
        draggable: true,
      }),
      0,
    ] as const;

    return [...figure];
  },

  addAttributes() {
    return {
      attachmentId: { default: null },
      caption: {
        default: "",
        parseHTML: (element) => findAttribute(element, "caption"),
      },
      progress: {
        default: 0,
      },
      sgid: {
        default: null,
        parseHTML: (element) => findAttribute(element, "sgid"),
      },
      src: {
        default: null,
        parseHTML: (element) => findAttribute(element, "src"),
      },
      height: {
        default: null,
        parseHTML: (element) => findAttribute(element, "height"),
      },
      width: {
        default: null,
        parseHTML: (element) => findAttribute(element, "width"),
      },
      contentType: {
        default: null,
        parseHTML: (element) =>
          findAttribute(element, "content-type") || "application/octet-stream",
      },
      fileName: {
        default: "",
        parseHTML: (element) => findAttribute(element, "filename"),
      },
      fileSize: {
        default: "",
        parseHTML: (element) => findAttribute(element, "filesize"),
      },
      content: {
        default: "",
        parseHTML: (element) => findAttribute(element, "content"),
      },
      url: {
        default: null,
        parseHTML: (element) => findAttribute(element, "url"),
      },
    };
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const {
        content,
        contentType,
        sgid,
        fileName,
        progress,
        fileSize,
        url,
        src,
        width,
        height,
        caption,
      } = node.attrs;

      const figure = document.createElement("figure");
      const figcaption = document.createElement("figcaption");

      figcaption.setAttribute("class", "attachment__caption");
      // figcaption.setAttribute("contenteditable", "true")

      figure.setAttribute("class", this.options.HTMLAttributes.class);
      figure.setAttribute("data-trix-content-type", node.attrs.contentType);

      // Convenient way to tell us its "final"
      if (sgid) figure.setAttribute("sgid", sgid);

      figure.setAttribute(
        "data-trix-attachment",
        JSON.stringify({
          contentType,
          content,
          filename: fileName,
          filesize: fileSize,
          height,
          width,
          sgid,
          url,
        })
      );

      figure.setAttribute(
        "data-trix-attributes",
        JSON.stringify({
          presentation: "gallery",
          caption,
        })
      );

      const attachmentEditor = document.createElement(
        "attachment-editor"
      ) as AttachmentEditor;
      attachmentEditor.setAttribute("file-name", fileName);
      attachmentEditor.setAttribute("file-size", fileSize);
      attachmentEditor.setAttribute("contenteditable", "false");

      if (!sgid) {
        attachmentEditor.setAttribute("progress", progress);
      } else {
        attachmentEditor.setAttribute("progress", "100");
      }

      figure.addEventListener("click", (e: Event) => {
        if (e.composedPath().includes(figcaption)) {
          return;
        }

        if (typeof getPos === "function") {
          editor
            .chain()
            .setTextSelection(getPos() + 1)
            .run();
        }
      });

      const img = document.createElement("img");
      img.setAttribute("contenteditable", "false");
      img.setAttribute("width", width);
      img.setAttribute("height", height);
      if (!content) {
        if (url || src) {
          img.setAttribute("src", url || src);
        }
        if (width == null || height == null) {
          img.src = url || src;
          img.onload = () => {
            const { naturalHeight: height, naturalWidth: width } = img;

            if (typeof getPos === "function") {
              const view = editor.view;
              view.dispatch(
                view.state.tr.setNodeMarkup(getPos(), undefined, {
                  ...node.attrs,
                  height: height,
                  width: width,
                })
              );
            }
          };
        }
      }

      if (content) {
        figure.innerHTML = content;
        figure.append(attachmentEditor, figcaption);
      } else {
        figure.append(attachmentEditor, img, figcaption);
      }

      return {
        dom: figure,
        contentDOM: figcaption,
        update: (node) => {
          if (node.type !== this.type) return false;

          const caption = figcaption.innerHTML;
          if (node.attrs.caption !== caption && typeof getPos === "function") {
            // Don't ask me why this works, but we need the position before the setTimeout call.
            const pos = getPos();
            setTimeout(() => {
              editor.view.dispatch(
                editor.view.state.tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  caption,
                })
              );
            });
          }
          return false;
        },
      };
    };
  },

  addCommands() {
    return {
      setAttachment:
        (options: AttachmentManager | AttachmentManager[]) =>
        ({ state, tr, dispatch, commands }) => {
          const currentSelection = state.doc.resolve(state.selection.anchor);
          const before = state.selection.anchor - 2 < 0 ? 0 : state.selection.anchor - 2
          const nodeBefore = state.doc.resolve(before)

					// If we're in a paragraph directly following a gallery.
					const isInGalleryCurrent = currentSelection.node(1).type.name === "attachment-gallery"
					const isInGalleryAfter = nodeBefore.node(1)?.type.name === "attachment-gallery"

					const isInGallery = isInGalleryCurrent || isInGalleryAfter

					const { schema } = state
          const attachments: AttachmentManager[] = Array.isArray(options)
            ? options
            : ([] as AttachmentManager[]).concat(options);

          const attachmentNodes = attachments.map((attachment) => {
          	return schema.nodes["attachment-figure"].create(
          		attachment,
          		[
                schema.text(attachment.caption || "")
              ],
            );
          });

					if (isInGallery) {
						const end = currentSelection.end()
						const backtrack = isInGalleryCurrent ? 0 : 2
						tr.insert(end - backtrack, attachmentNodes);
					} else {
          	const gallery = schema.nodes["attachment-gallery"].create({}, attachmentNodes);
          	// return commands.insertContent(attachmentNodes.map((node) => node.toJSON()));
          	const currSelection = state.selection
						tr.replaceWith(currSelection.from - 1, currSelection.to, [
							schema.nodes.paragraph.create(),
							gallery,
							schema.nodes.paragraph.create(),
						]);
						selectionToInsertionEnd(tr, tr.steps.length - 1, -1)
					}


					if (dispatch) dispatch(tr)
					return true
        },
    };
  },
});

export const AttachmentFigcaption = Node.create({
  name: "attachment-figcaption",
  group: "block figcaption",
  content: "inline*",
  selectable: false,
  draggable: false,
  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: { class: "attachment__caption attachment--edited" },
    };
  },

  parseHTML() {
    return [
      {
        tag: `figcaption.attachment__caption`,
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

/**
 * Plugin to fix firefox cursor disappearing inside contenteditable.
 * https://github.com/ProseMirror/prosemirror/issues/1113#issue-780389225
 */
export function FirefoxCaretFixPlugin() {
  let focusing = false;
  return new Plugin({
    props: {
      handleDOMEvents: {
        focus: (view) => {
          if (focusing) {
            focusing = false;
          } else {
            focusing = true;
            setTimeout(() => {
              view.dom.blur();
              view.dom.focus();
            });
          }
          return false;
        },
      },
    },
  });
}

export default Extension.create({
  addProseMirrorPlugins() {
    return [FirefoxCaretFixPlugin()];
  },
  addExtensions() {
    return [
      AttachmentGallery,
      Attachment,
      AttachmentImage,
      AttachmentFigcaption,
    ];
  },
});
