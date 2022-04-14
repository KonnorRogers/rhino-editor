import { tipTapCoreStyles } from "./tip-tap-core-styles"
import { Editor } from '@tiptap/core'

// https://tiptap.dev/api/extensions/starter-kit#included-extensions
import StarterKit from '@tiptap/starter-kit'
import Link from "@tiptap/extension-link"
import Image from '@tiptap/extension-image'

import { css, html, LitElement } from 'lit'
import { ref } from 'lit/directives/ref.js';

import * as icons from './icons'
import { normalize } from '../normalize'

// class DelegatesFocus extends LitElement {
//   static shadowRootOptions = {...LitElement.shadowRootOptions, delegatesFocus: true};
// }

export class TipTapElement extends LitElement {
  static get properties () {
    return {
      editor: {attribute: false},
      input: {}
    }
  }

  static get styles () {
    return css`
      ${normalize}
      ${tipTapCoreStyles}
      :host {
        --border-color: #d4d4d8;
      }
      .ProseMirror .placeholder::before {
        position: absolute;
        pointer-events: none;
        color: #cecece;
        cursor: text;
        content: attr(data-placeholder);
      }

      .ProseMirror {
        border: 1px solid var(--border-color);
        border-radius: 3px;
        margin: 0;
        padding: 0.4em 0.6em;
        min-height: 5em;
        outline: none;
      }

      .ProseMirror p {
        padding: 0;
        margin: 0;
        min-width: 1px;
      }

      .toolbar {
        padding: 0.75em 0;
        display: flex;
      }

      img {
        width: 100%;
        height: auto;
        display: block;
      }

      ::part(button) {
        height: 2rem;
        width: 2.5rem;
        contain: strict;
        background-color: white;
        border: none;
        padding: 0 0.5rem;
        position: relative;
        margin: -1px;
        border: 1px solid var(--border-color);
      }

      ::part(button--active),
      ::part(button--active):is(:hover, :focus) {
        background-color: hsl(200.6 94.4% 86.1%);
      }


      ::part(button):where(:focus, :hover) {
        outline: none;
        background-color: cornsilk;
      }

      ::part(button__link),
      ::part(button__numbers) {
        margin-right: 1rem;
      }

      ::part(button__files) {
        margin-right: auto;
      }

      svg {
        height: 100%;
        width: 100%;
        display: block;
      }
    `
  }

  static get icons () {
    return icons
  }

  get icons () {
    return this.constructor.icons
  }

  editorElementChanged (element) {
    this.editor = this.setupEditor(element)
  }

  activeButton (action) {
    return this.editor.isActive(action) ? "button--active" : ""
  }

  setupEditor (element) {
    return new Editor({
      element: element,
      extensions: [
        StarterKit,
        Link,
        Image,
      ],
      content: this.inputElement?.value,
      // onBeforeCreate: ({ editor }) => {
      //   // Before the view is created.
      // },
      onCreate: ({ editor }) => {
        // The editor is ready.
        // element.outerHTML = element.innerHTML
        this.requestUpdate()
      },
      onUpdate: ({ editor }) => {
        // The content has changed.
        this.inputElement.value = this.editor.getHTML()
        this.requestUpdate()
      },
      onSelectionUpdate: ({ editor }) => {
        // The selection has changed.
        // this.requestUpdate()
      },
      onTransaction: ({ editor, transaction }) => {
        // The editor state has changed.
        this.requestUpdate()
      },
      onFocus: ({ editor, event }) => {
        // The editor is focused.
        this.requestUpdate()
      },
      onBlur: ({ editor, event }) => {
        // The editor isn’t focused anymore.
        this.inputElement.value = this.editor.getHTML()
        // this.requestUpdate()
      },
      // onDestroy: () => {
      //   // The editor is being destroyed.
      // },
    })
  }

  get inputElement () {
    return document.getElementById(this.input)
  }

  activeElement (action) {
    return this.editor?.isActive(action) ? "button--active" : ""
  }

  run (action, ...args) {
    this.editor.chain().focus()[action](...args).run() // && this.requestUpdate()
  }

  buttonParts (partName, actionName) {
    return `button button__${partName} ${this.activeElement(actionName ?? partName)}`
  }

  getLink () {
    return new Promise((resolve, reject) => {
      try {
        const url = window.prompt("URL:")
        resolve(url)
      } catch(e) {
        reject(e)
      }
    })
  }

  attachFiles () {
    return new Promise((resolve, reject) => {
      const input = makeElement("input", { type: "file", multiple: true, hidden: true, id: "TODO" })

      input.addEventListener("change", () => {
        const files = input.files
        const imgUrls = []
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const src = URL.createObjectURL(file);
          imgUrls.push(src)
          // const onload = () => URL.revokeObjectURL(src);
          console.log(file.name + ": " + file.size + " bytes");
        }
        const chain = this.editor.chain().focus()

        imgUrls.forEach((src) => chain.setImage({ src }))
        chain.run()
        input.remove()
      })

      document.body.appendChild(input)
      input.click()
      resolve()
    })
  }

  render () {
    return html`
      <div class="toolbar" part="toolbar">
        <button part=${this.buttonParts("bold")} @click=${() => this.run("toggleBold")} title="Bold">
          ${this.icons.bold}
        </button>

        <button part=${this.buttonParts("italics", "italic")} @click=${() => this.run("toggleItalic")} title="Italics">
          ${this.icons.italics}
        </button>

        <button part=${this.buttonParts("strike-through", "strike")} @click=${() => this.run("toggleStrike")} title="Strikethrough">
          ${this.icons.strikeThrough}
        </button>

        <button
          part=${this.buttonParts("link")}  title="Link"
          @click=${async () => {
            const href = await this.getLink()
            console.log(href)
            if (href) {
              this.editor.chain().focus().toggleLink({ href: href }).run()
            } else {
              this.editor.chain().focus().run()
            }
          }}>
          ${this.icons.link}
        </button>

        <button part=${this.buttonParts("heading")} @click=${() => this.run("toggleHeading", { level: 1 })} title="Heading">
          ${this.icons.heading}
        </button>

        <button part=${this.buttonParts("quote", "blockquote")} @click=${() => this.run("toggleBlockquote")} title="Quote">
          ${this.icons.quote}
        </button>

        <button part=${this.buttonParts("code")} @click=${() => this.run("toggleCode")} title="Code">
          ${this.icons.code}
        </button>

        <button part=${this.buttonParts("bullets", "bulletList")} @click=${() => this.run("toggleBulletList")} title="Bullets">
          ${this.icons.bullets}
        </button>

        <button part=${this.buttonParts("numbers", "orderedList")} @click=${() => this.run("toggleOrderedList")} title="Numbers">
          ${this.icons.numbers}
        </button>

        <button part=${this.buttonParts("files")} @click=${async () => await this.attachFiles()} title="Attach Files">
          ${this.icons.files}
        </button>

        <button part=${this.buttonParts("undo")} @click=${() => this.run("undo")} aria-disabled=${!this.editor?.can().undo()} title="Undo">
          ${this.icons.undo}
        </button>

        <button part=${this.buttonParts("redo")} @click=${() => this.run("redo")} aria-disabled=${!this.editor?.can().redo()} title="Redo">
          ${this.icons.redo}
        </button>
      </div>

      <div ${ref(this.editorElementChanged)}></div>
    `
  }
}

function makeElement (tag, obj = {}) {
  const el = document.createElement(tag)
  for (const [key, value] of Object.entries(obj)) {
    el[key] = value
  }

  return el
}

export default TipTapElement
