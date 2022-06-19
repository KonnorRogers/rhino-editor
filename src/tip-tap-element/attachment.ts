import { Node, mergeAttributes, Extension } from "@tiptap/core";
import Image from "@tiptap/extension-image";

export interface AttachmentOptions {
  HTMLAttributes: Record<string, any>;
}

interface AttachmentArgs {
  src: string;
  fileName?: string;
  fileSize?: number;
  contentType?: string;
  caption?: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    attachment: {
      /**
       * Add an attachment(s)
       */
      setAttachment: (options: AttachmentArgs | AttachmentArgs[]) => ReturnType;
    };
  }
}

export const inputRegex = /(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/;

const AttachmentImage = Image.extend({
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
      src: { default: null },
      height: { default: null },
      width: { default: null },
      contentType: { default: null },
      fileName: { default: null },
      fileSize: { default: null },
      content: { default: null },
    };
  },

  addNodeView() {
    return ({ node, getPos, editor }) => {
      const figure = document.createElement("figure");
      const attachmentEditor = document.createElement("attachment-editor")
      attachmentEditor.setAttribute("file-name", node.attrs.fileName)
      attachmentEditor.setAttribute("file-size", node.attrs.fileSize)

      const img = document.createElement("img");
      img.src = node.attrs.src;
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
      setAttachment: (options: AttachmentArgs | AttachmentArgs[]) => ({
        commands,
      }) => {
        const attachments = Array.isArray(options)
          ? options
          : [].concat(options);
        const content = [];

        attachments.forEach((attachment) => {
          let captionContent: { type: "text"; text: string }

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
