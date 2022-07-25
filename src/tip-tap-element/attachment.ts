import { Node, mergeAttributes, Extension } from "@tiptap/core";
import {default as TipTapImage } from "@tiptap/extension-image";
import { AttachmentManager } from "../attachment-upload";

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
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure",
        contentElement: "figcaption",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      this.options.HTMLAttributes,
      [
        "img",
        mergeAttributes(HTMLAttributes, {
          draggable: false,
          contenteditable: false,
        }),
      ],
      ["figcaption", 0],
    ];
  },

  addAttributes() {
    return {
      attachmentId: { default: null },
      imageId: { default: null },
      sgid: { default: null },
      src: { default: null },
      height: { default: null },
      width: { default: null },
      contentType: { default: null },
      fileName: { default: null },
      fileSize: { default: null },
      content: { default: null },
      url: { default: null },
    };
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const figure = document.createElement("figure");
      const attachmentEditor = document.createElement("attachment-editor")
      attachmentEditor.setAttribute("data-attachment-id", node.attrs.attachmentId)
      attachmentEditor.setAttribute("file-name", node.attrs.fileName)
      attachmentEditor.setAttribute("file-size", node.attrs.fileSize)

      const img = document.createElement("img");
      Object.defineProperties(img, {
        src: {
          set (val: string) {
            const image = new Image()
            image.src = val

            image.onload = () => {
              node.attrs.src = val
              this.setAttribute("src", val)
              image.remove()
            }
          }
        },
        sgid: {
          set (val: string) {
            node.attrs.sgid = val
            this.setAttribute("sgid", val)
          }
        }
      })
      img.setAttribute("data-image-id", node.attrs.imageId)
      img.setAttribute("src", node.attrs.src);
      img.setAttribute("sgid", node.attrs.sgid)
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

      figure.append(attachmentEditor, img, figcaption);

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

export default Extension.create({
  addExtensions() {
    return [Attachment, AttachmentImage, Figcaption];
  },
});
