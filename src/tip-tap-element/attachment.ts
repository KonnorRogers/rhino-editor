import {
  Node,
  nodeInputRule,
  mergeAttributes,
} from '@tiptap/core'

import { makeElement } from './make-element'

export interface AttachmentOptions {
  inline: boolean,
  allowBase64: boolean,
  HTMLAttributes: Record<string, any>,
}

export interface AttachmentMetadata {
  fileName?: string
  fileSize?: number
  contentType?: string
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    attachment: {
      /**
       * Add an attachment
       */
      setAttachment: (options: { src: string, metadata: AttachmentMetadata }) => ReturnType,
    }
  }
}

export const inputRegex = /(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/

const closeIcon = `
<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" height="16" width="16" class="bi bi-x" viewBox="0 0 16 16">
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
</svg>
`

function toFileSize (num) {
  const kb = num / 1024

  if (kb < 1) {
    return `${num} bytes`
  }

  if (kb < 1024) {
    return `${kb.toFixed(2)} KB`
  }

  const mb = kb / 1024

  return `${mb.toFixed(2)} MB`
}

let Attachment = Node.create<AttachmentOptions>({
  name: 'attachment',

  addOptions() {
    return {
      inline: false,
      allowBase64: false,
      HTMLAttributes: {},
    }
  },

  inline() {
    return this.options.inline
  },

  group() {
    return this.options.inline ? 'inline' : 'block'
  },

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      height: { default: null },
      width: { default: null },
      metadata: {
        default: {}
      }
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure img[src]'
      },
      {
        tag: 'figure video[src]'
      },
    ]
  },

  renderHTML(args) {
    let { src, width, height } = args.HTMLAttributes
    return ['figure', ['img', mergeAttributes(this.options.HTMLAttributes, { src, width, height })]]
  },

  addCommands() {
    return {
      setAttachment: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    }
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: inputRegex,
        type: this.type,
        getAttributes: match => {
          const [,,, src] = match

          return { src }
        },
      }),
    ]
  },
  addNodeView() {
    return ({
      node,
      HTMLAttributes,
      getPos,
      editor,
    }) => {
      const container = makeElement("div", {className: "attachment__editor", contentEditable: "false"})
      const button = makeElement("button", {className: "attachment__button"})
      const figure = makeElement('figure', {className: "attachment__figure"})
      const metadataEl = makeElement("span", {className: "attachment__metadata"})
      const editCaption = makeElement("button", {className: "attachment__edit-caption" })
      const caption = makeElement("caption", {className: "attachment__caption"})

      const { metadata, src, height, width } = node.attrs

      const img = makeElement('img', { className: "attachment", src, height, width })

      img.onload = () => {
        if (editor.isEditable && typeof getPos === 'function') {
          const height = img.naturalHeight;
          const width = img.naturalWidth;
          editor
            .chain()
            .focus(undefined, { scrollIntoView: false })
            .command(({ tr }) => {
              const position = getPos()
              const currentNode = tr.doc.nodeAt(position)
              tr.setNodeMarkup(position, undefined, {
                // src,
                // height,
                // width,
                // metadata
                ...currentNode?.attrs,
                height,
                width
              })

              return true
            })
            .run()
        }
      }

      const fileName = makeElement("span", {className: "attachment__metadata__file-name", innerText: metadata.fileName})
      const fileSize = makeElement("span", {className: "attachment__metadata__file-size", innerText: toFileSize(metadata.fileSize)})
      metadataEl.append(fileName, fileSize)

      button.innerHTML = closeIcon

      figure.append(button, metadataEl, img)
      container.append(figure)

      button.addEventListener("click", (event) => {
        event.preventDefault()
        container.remove()
      })

      return {
        dom: container,
        contentDOM: figure,
      }
    }
  },
})

export default Attachment
