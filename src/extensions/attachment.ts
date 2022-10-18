import { Node, Extension, mergeAttributes } from "@tiptap/core";
import { default as TipTapImage } from "@tiptap/extension-image"
import { AttachmentManager } from "src/models/attachment-manager";
import type { AttachmentEditor } from "src/elements/attachment-editor";
import { Plugin } from "prosemirror-state";

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

export const inputRegex = /(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

const AttachmentImage = TipTapImage.extend({
  selectable: false,
  draggable: false,
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

  addOptions() {
    return {
      HTMLAttributes: {
        class: "attachment attachment--preview attachment--png",
        "data-trix-attributes": JSON.stringify({ presentation: "gallery" }),
      },
    };
  },

  parseHTML() {
  	// action-text-attachment must be before figure.
    return [
      {
        tag: "action-text-attachment",
      },
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
      caption,
      url,

      // Image
      src,
      width,
      height,
    } = node.attrs;

    const attachmentAttrs: Record<keyof typeof node.attrs, string> = {
      contentType,
      filename: fileName,
      height,
      width,
      sgid,
      url,
    }

    if (content != null) {
    	attachmentAttrs.content = content
    }

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
		] as const

		const img = [
			"img",
			mergeAttributes({}, {src: url || src, height, width}),
		] as const

		const figcaption = [
			"figcaption",
			mergeAttributes({}, {class: "attachment__caption attachment__caption--edited"}),
			0
		] as const

		if (!content) {
			return [
				...figure,
				[...img],
				[...figcaption]
			]
		}

		return [
			...figure,
			[...figcaption]
		]
  },

  addAttributes() {
    return {
      attachmentId: { default: null },
      caption: {
      	default: "",
				parseHTML: (element) => {
      		const attrs = element.getAttribute("data-trix-attributes")

      		if (!attrs) return null

					const { caption }  = JSON.parse(attrs)

					return caption || null
				},
      },
      progress: {
      	default: 0,
      },
      sgid: {
      	default: null,
      	parseHTML: (element) => {
					const sgidAttr = element.getAttribute("sgid")
					if (sgidAttr) return sgidAttr

					// This is for regular <figure>
      		const attrs = element.getAttribute("data-trix-attachment")
      		if (!attrs) return null

					const { sgid }  = JSON.parse(attrs)

					return sgid || null
				}
      },
      src: {
        default: null,
        parseHTML: (element) => {
        	return element.querySelector("img")?.getAttribute("src")
        }
      },
      height: {
      	default: null,
      	parseHTML: (element) => element.querySelector("img")?.getAttribute("height")
      },
      width: {
      	default: null ,
      	parseHTML: (element) => element.querySelector("img")?.getAttribute("width")
      },
      contentType: {
        default: null,
        parseHTML: (element) => {
      		const attrs = element.getAttribute("data-trix-attachment")
      		if (!attrs) return null

					const { contentType }  = JSON.parse(attrs)
					return contentType || "application/octet-stream"
        }
      },
      fileName: {
      	default: ""
      },
      fileSize: { default: "" },
      content: {
      	default: null,
      	parseHTML: (element) => {
      		const attrs = element.getAttribute("data-trix-attachment")
      		if (!attrs) return null

					const { content }  = JSON.parse(attrs)
					return content || null
      	}
      },
      url: {
      	default: null,
        parseHTML: (element) => {
      		const attrs = element.getAttribute("data-trix-attachment")
      		if (!attrs) return null

					const { url }  = JSON.parse(attrs)
					return url || null
        }
      },
      href: { default: null },
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
        // href,
        caption,
      } = node.attrs;

      const figure = document.createElement("figure");
      const figcaption = document.createElement("figcaption")

			figcaption.setAttribute("class", "attachment__caption")

      figure.setAttribute("class", this.options.HTMLAttributes.class);
      figure.setAttribute("data-trix-content-type", node.attrs.contentType);

      // // Convenient way to tell us its "final"
      if (sgid) figure.setAttribute("sgid", sgid);

      figure.setAttribute(
        "data-trix-attachment",
        JSON.stringify({
          contentType,
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

      if (!sgid) {
        attachmentEditor.setAttribute("progress", progress)
      } else {
        attachmentEditor.setAttribute("progress", "100");
      }


      figure.addEventListener("click", (e: Event) => {
      	figure.removeAttribute("contenteditable")
      	if (e.composedPath().includes(figcaption)) return

				if (typeof getPos === "function") {
      		editor.chain().setTextSelection(getPos() + 1).run()
      	}
      });

			// Hacky fix for firefox which doesn't like to let you drag contenteditable.
			const handlePointerDown = (e: Event) => {
        if (e.composedPath().includes(figcaption)) {
      		figure.removeAttribute("contenteditable")
        	return;
        }

				figure.setAttribute("contenteditable", "false")
			}
      const handlePointerUp = () => {
      	figure.removeAttribute("contenteditable")
      }

      figure.addEventListener("pointerdown", handlePointerDown)
      figure.addEventListener("pointerup", handlePointerUp)

      const img = document.createElement("img")
      img.setAttribute("width", width);
      img.setAttribute("height", height);
      if (!content) {
      	if (url || src) {
      		img.setAttribute("src", url || src);
      	}
      	if (width == null || height == null) {
      		img.src = url || src
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
      	figure.innerHTML = content
      	figure.append(attachmentEditor, figcaption)
      } else {
      	figure.append(attachmentEditor, img, figcaption)
      }

      return {
        dom: figure,
        contentDOM: figcaption,
        update: (node) => {
        	if (node.type !== this.type) return false

        	const caption = figcaption.innerHTML
        	if (node.attrs.caption !== caption && typeof getPos === "function") {
        		// Don't ask me why this works, but we need the position before the setTimeout call.
						const pos = getPos()
        		setTimeout(() => {
        			editor.view.dispatch(
								editor.view.state.tr.setNodeMarkup(pos, undefined, {
									...node.attrs,
									caption
								})
        			)
        		})
        	}
        	return false
        }
      }
    };
  },

  addCommands() {
    return {
      setAttachment:
        (options: AttachmentManager | AttachmentManager[]) =>
        ({ commands, state }) => {
        	const currentSelection = state.doc.resolve(state.selection.anchor)

        	const endPos = currentSelection.after()

          const attachments: AttachmentManager[] = Array.isArray(options)
            ? options
            : ([] as AttachmentManager[]).concat(options);
          const content: Array<Record<string, unknown>> = [];

          attachments.forEach((attachment) => {
						const attachmentContent: Record<string, unknown> = {
							type: "attachment-figure",
							attrs: attachment,
						}

						if (attachment.caption) {
							attachmentContent.content = [
								{
									type: "text",
									text: attachment.caption
								}
							]
						}

            content.push(attachmentContent)
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

          return commands.insertContentAt(endPos, content);
        },
    };
  },
});

export const AttachmentFigcaption = Node.create({
  name: 'attachment-figcaption',

  group: "block figcaption",

  addOptions() {
    return {
      HTMLAttributes: {class: "attachment__caption attachment--edited"},
    }
  },

  content: 'inline*',

  // selectable: false,
  // draggable: false,
  isolating: true,

  parseHTML() {
    return [
      {
        tag: `figcaption`,
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['figcaption', mergeAttributes(HTMLAttributes), 0]
  },
})

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
    return [Attachment, AttachmentImage, AttachmentFigcaption];
  },
});

