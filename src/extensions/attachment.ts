import { Node, Extension, mergeAttributes } from "@tiptap/core"
import {default as TipTapImage } from "@tiptap/extension-image";
import { AttachmentManager } from "src/models/attachment-manager";
import type { AttachmentEditor } from "src/elements/attachment-editor";
import { Plugin } from 'prosemirror-state'

export interface AttachmentOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    attachment: {
      /**
       * Add an attachment(s)
       */
      setAttachment: (options: AttachmentManager | AttachmentManager[]) => ReturnType;
    };
  }
}

export const inputRegex = /(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

const AttachmentImage = TipTapImage.extend({
  selectable: false,
  draggable: false,
});

const Attachment = Node.create({
  name: "attachment-figure",
  group: "block attachmentFigure",
  content: "paragraph*",
  draggable: true,
  selectable: true,
  isolating: true,

  addOptions() {
    return {
      HTMLAttributes: {
        className: "attachment attachment--preview attachment--png",
        "data-trix-attributes": JSON.stringify({presentation: "gallery"})
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "action-text-attachment",
        contentElement: "figcaption",
      },
      {
        tag: "figure",
        contentElement: "figcaption",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {

    const {
      // Figure
      contentType, sgid, fileName,

      // Image
      imageId, src, width, height
    } = HTMLAttributes

    return [
      "figure",
      mergeAttributes(this.options.HTMLAttributes, {
        "data-trix-content-type": contentType,
        "data-trix-attachment": JSON.stringify({
          contentType,
          filename: fileName,
          height,
          width,
          sgid
        }),
        "data-trix-attributes": JSON.stringify({
          presentation: "gallery"
        })
      }),
      [
        "img",
        mergeAttributes({}, {
          src,
          "data-image-id": imageId,
          draggable: false,
          contenteditable: false,
          width,
          height
        }),
      ],
      ["figcaption", 0],
    ];
  },

  addAttributes() {
    return {
    	attachmentId: { default: null },
      progress: { default: null },
      imageId: { default: null },
      sgid: { default: null },
      src: {
      	default: null,
      	parseHTML: element => element.querySelector("img")?.getAttribute("src")
      },
      height: { default: null },
      width: { default: null },
      contentType: {
      	default: null,
      	parseHTML: element => element.getAttribute("content-type")
      },
      fileName: { default: null },
      fileSize: { default: null },
      content: { default: null },
      url: { default: null },
      href: { default: null }
    };
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const {
        contentType,
        sgid,
        fileName,
        progress,
        fileSize,
        url,
        imageId,
        src,
        width,
        height,
        href
      } = node.attrs

      const figure = document.createElement("figure");

      figure.setAttribute("class", this.options.HTMLAttributes.className)
      figure.setAttribute("data-trix-content-type", node.attrs.contentType)

			// // Convenient way to tell us its "final"
      if (sgid != null) figure.setAttribute("sgid", sgid)

      figure.setAttribute("data-trix-attachment", JSON.stringify({
        contentType,
        filename: fileName,
        filesize: fileSize,
        height,
        width,
        sgid,
        url
      }))

      figure.setAttribute("data-trix-attributes", JSON.stringify({
        presentation: "gallery"
      }))

      const attachmentEditor = document.createElement("attachment-editor") as AttachmentEditor
      attachmentEditor.setAttribute("file-name", fileName)
      attachmentEditor.setAttribute("file-size", fileSize)

      if (sgid == null) {
      	attachmentEditor.progress = progress
      } else {
      	attachmentEditor.progress = 100
      }

      const img = document.createElement("img");
      const image = new Image()
      image.src = src

			if (width == null || height == null) {
      	image.onload = () => {
        	const { naturalHeight: height, naturalWidth: width } = image

					if (typeof getPos === "function") {
						const view = editor.view
        		view.dispatch(view.state.tr.setNodeMarkup(getPos(), undefined, {
          		...node.attrs,
          		height: height,
          		width: width
        		}))
					}
      	}
      }

      img.setAttribute("data-image-id", imageId)
      img.setAttribute("src", src);
      img.setAttribute("width", width)
      img.setAttribute("height", height)
      img.contentEditable = "false";
      img.setAttribute("draggable", "false");
      const figcaption = document.createElement("figcaption");

      figure.addEventListener("click", (e: Event) => {
        if (e.composedPath().includes(figcaption)) return

        if (typeof getPos === "function") {
          e.preventDefault()
          const pos = editor.state.doc.resolve(getPos()).pos
          editor.chain().setTextSelection(pos).selectTextblockEnd().run()
        }
      });

      if (href) {
        const anchor = document.createElement("a")
        anchor.href = href
        anchor.tabIndex = -1
        anchor.contentEditable = "false"
        anchor.append(img)
        figure.append(attachmentEditor, anchor, figcaption);
      } else {
        figure.append(attachmentEditor, img, figcaption);
      }

      return {
        dom: figure,
        contentDOM: figcaption,
      };
    };
  },

  addCommands() {
    return {
      setAttachment: (options: AttachmentManager | AttachmentManager[]) => ({
        commands,
      }) => {
        const attachments: AttachmentManager[] = Array.isArray(options)
          ? options
          : ([] as AttachmentManager[]).concat(options);
        const content: Record<string, unknown>[] = [];

        attachments.forEach((attachment) => {
          let captionContent: { type: "text"; text: string } | undefined

          if (attachment.caption) {
            captionContent = {
              type: "text",
              text: attachment.caption
            }
          }

          content.push({
            type: "attachment-figure",
            attrs: attachment,
            content: [
              {
                type: "paragraph",
                content: [
                  captionContent
                ],
              },
            ],
          });
          content.push({
            type: "paragraph",
          });
          content.push({
            type: "paragraph",
          });
          content.push({
            type: "paragraph",
          });
        });

        return commands.insertContent(content);
      },
    };
  },
});

const Figcaption = Node.create({
  name: "figcaption",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  content: "paragraph*",
  isolating: true,
  selectable: false,
  draggable: false,

  parseHTML() {
    return [
      {
        tag: "figcaption",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["figcaption", mergeAttributes(HTMLAttributes), 0];
  },
});


/**
 * Plugin to fix firefox cursor disappearing inside contenteditable.
 * https://github.com/ProseMirror/prosemirror/issues/1113#issue-780389225
 */
export function FirefoxCaretFixPlugin () {
  let focusing = false
  return new Plugin({
    props: {
      handleDOMEvents: {
        focus: view => {
          if (focusing) {
          	focusing = false
          } else {
            focusing = true
            setTimeout(() => { view.dom.blur(); view.dom.focus() })
          }
          return false
        }
      }
    }
  })
}

export default Extension.create({
	addProseMirrorPlugins () {
		return [FirefoxCaretFixPlugin()]
	},
  addExtensions() {
    return [Attachment, AttachmentImage, Figcaption];
  },
});
