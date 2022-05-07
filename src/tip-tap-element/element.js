import { tipTapCoreStyles } from "./tip-tap-core-styles"
import { Editor } from '@tiptap/core'


// https://tiptap.dev/api/extensions/starter-kit#included-extensions
import StarterKit from '@tiptap/starter-kit'
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Attachment from './attachment'
import { makeElement } from './make-element'

import { css, html, LitElement } from 'lit'
import { ref, createRef } from 'lit/directives/ref.js';

import * as icons from './icons'
import { normalize } from '../normalize'

export class TipTapElement extends LitElement {
  static get properties () {
    return {
      editor: {attribute: false},
      linkDialogExpanded: {},
      input: {}
    }
  }

  static get styles () {
    return css`
      ${normalize}
      ${tipTapCoreStyles}

      :host {
        --border-color: #cecece;
        --focus-ring: 0 0 2px 1px hsl(200 80% 50%);
        color: #374151;
      }

      .ProseMirror .placeholder {
        position: absolute;
        pointer-events: none;
        color: #cecece;
        cursor: text;
        content: "";
      }

      .ProseMirror {
        border: 1px solid var(--border-color);
        border-radius: 3px;
        margin: 0;
        padding: 0.4em 0.6em;
        min-height: 200px;
        outline: none;
      }

      .toolbar {
        padding: 1rem 3px;
        display: flex;
        overflow-x: auto;
        align-items: center;
        color: hsl(219, 6%, 43%);
      }

      img, svg {
        width: 100%;
      }

      img, svg, figure {
        max-width: 100%;
        height: auto;
        display: block;
      }

      figure, p {
        margin: 0;
        padding: 0;
      }

      button {
        background-color: white;
        border: none;
        color: inherit;
      }

      button:is(:focus, :hover):not([aria-disabled="true"], :disabled) {
        outline: none;
        background-color: rgb(240, 240, 240);
      }

      .toolbar__button {
        height: 2rem;
        min-width: 2.5rem;
        contain: strict;
        position: relative;
        margin: -1px;
        border: 1px solid var(--border-color);
      }

      .toolbar__button:is([aria-disabled="true"]:not([part*="button--active"])) {
        pointer-events: none;
        color: hsl(219, 6%, 80%);
        border-color: hsl(219, 6%, 88%);
      }

      .toolbar__button:is([part*="button--active"]),
      .toolbar__button:is([part*="button--active"]):is(:hover, :focus) {
        color: hsl(200, 100%, 46%);
      }

      .toolbar__button:is([part*="button__link"], [part*="button__orderedList"]) {
        margin-right: 1rem;
      }

      .toolbar__button[part*="button__files"] {
        margin-right: auto;
      }

      .link-dialog {
        position: absolute;
        z-index: 1;
        height: 100%;
        width: 100%;
        padding: 1px;
      }

      .link-dialog__container {
        display: flex;
        align-items: center;
        background: white;
        box-shadow: 0 0.3em 1em #ccc;
        max-width: 600px;
        padding: 0.75rem 0.4rem;
        border-radius: 8px;
        border-top: 2px solid #ccc;
      }

      .link-validate:invalid {
        background-color: #ffdddd;
      }

      .link-dialog__input {
        border: 1px solid #374151;
        border-radius: 4px;
        padding: 0.4em 0.6em;
        flex: 1 1 auto;
      }

      .link-dialog__input:is(:focus) {
        border: 1px solid blue;
        box-shadow: var(--focus-ring);
        outline: none;
      }

      .link-dialog__button {
        padding: 0.4em 0.6em;
        border: 1px solid gray;
        border-radius: 4px;
      }

      .link-dialog__buttons {
        margin-right: 0.5em;
        margin-left: 0.5em;
      }

      /* Attachments */
      .attachment__button {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(0, -50%);
        border-radius: 9999px;
        border: 1px solid skyblue;
        width: 1.8rem;
        height: 1.8rem;
        font-size: 1.8rem;
        display: none;
        align-items: center;
        justify-content: center;
      }

      .attachment__button svg {
        position: absolute;
      }

      .attachment__editor.ProseMirror-selectednode .attachment__button {
        display: flex;
      }

      .attachment__editor {
        position: relative;
      }

      .attachment__editor.ProseMirror-selectednode  {
        box-shadow: 0 0 0 2px skyblue;
      }

      .attachment__metadata {
        position: absolute;
        left: 50%;
        top: 2em;
        transform: translateX(-50%);
        max-width: 90%;
        padding: 0.1em 0.6em;
        font-size: 0.8em;
        color: #fff;
        background-color: rgba(0, 0, 0, 0.7);
        border-radius: 3px;
        text-align: center;
        outline: 1px solid hsl(0 0% 100% / 50%);
        display: none;
      }

      .attachment__editor.ProseMirror-selectednode .attachment__metadata {
        display: block;
      }

      .attachment__metadata__file-name {
        display: inline-block;
        max-width: 100%;
        vertical-align: bottom;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 0.2em;
      }

      .attachment__metadata__file-size {
        white-space: nowrap;
      }
    `
  }

  static get icons () {
    return icons
  }

  connectedCallback () {
    super.connectedCallback()
    this.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "escape" && this.linkDialogExpanded) {
        this.closeLinkDialog()
      }
    })
  }

  get icons () {
    return this.constructor.icons
  }

  constructor () {
    super()
    this.linkInputRef = createRef();
  }

  editorElementChanged (element) {
    // Non-light-dom version.
    // const div = document.createElement("div")
    // this.insertAdjacentElement("afterend", div)
    this.editor = this.setupEditor(element)
    this.editorElement = element
  }

  activeButton (action) {
    return this.editor.isActive(action) ? "button--active" : ""
  }

  setupEditor (element) {
    console.log(this.inputElement.value)
    return new Editor({
      element,
      extensions: [
        StarterKit,
        Link,
        Attachment,
        Image
      ],
      content: this.inputElement?.value,
      autofocus: true,
      editable: true,
      // onBeforeCreate: ({ editor }) => {
      //   // Before the view is created.
      // },
      onCreate: ({ editor }) => {
        // The editor is ready.
        this.requestUpdate()
      },
      onUpdate: ({ editor }) => {
        // The content has changed.
        this.inputElement.value = this.editor.getHTML()
        this.requestUpdate()
      },
      onSelectionUpdate: ({ editor }) => {
        // The selection has changed.
        this.requestUpdate()
      },
      onTransaction: ({ editor, transaction }) => {
        // The editor state has changed.
        this.requestUpdate()
      },
      onFocus: ({ editor, event }) => {
        // The editor is focused.
        this.closeLinkDialog()
        this.requestUpdate()
      },
      onBlur: ({ editor, event }) => {
        // The editor isn’t focused anymore.
        this.inputElement.value = this.editor.getHTML()
        this.requestUpdate()
      },
      // onDestroy: () => {
      //   // The editor is being destroyed.
      // },
    })
  }

  get inputElement () {
    return document.getElementById(this.input)
  }

  closeLinkDialog () {
    if (this.linkDialog == null) return

    this.linkDialogExpanded = false
    this.linkDialog.setAttribute("hidden", "")
  }

  showLinkDialog () {
    if (this.linkDialog == null) return

    this.linkDialogExpanded = true
    this.linkDialog.removeAttribute("hidden")
  }

  get linkDialog () {
    return this.shadowRoot.querySelector(".link-dialog")
  }

  activeButton (action) {
    return this.editor?.isActive(action) ? "button--active" : ""
  }

  disabledButton (action, ...args) {
    return this.can(action, ...args) ? "" : "button--disabled"
  }

  run (action, ...args) {
    if (this.ariaDisabled === "true") return

    this.editor.chain().focus()[action](...args).run() && this.requestUpdate()
  }

  toolbarButtonParts (actionName) {
    return `button button__${actionName} ${this.activeButton(actionName)}`
  }

  attachFiles () {
    return new Promise((resolve, reject) => {
      const input = makeElement("input", { type: "file", multiple: true, hidden: true })

      input.addEventListener("change", () => {
        const files = input.files
        console.log(files)
        const attachments = []
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const src = URL.createObjectURL(file);

          const attachment = { src, metadata: { contentType: file.type, fileName: file.name, fileSize: file.size } }
          attachments.push(attachment)
        }

        const chain = this.editor.chain().focus()
        attachments.forEach((attachment) => {
          // chain.setImage({ src: attachment.src })
          chain.setAttachment(attachment)
        })
        chain.run()

        input.remove()
        resolve()
      })

      document.body.appendChild(input)
      input.click()
    })
  }

  can (action, ...args) {
    return this.editor && this.editor.can()[action](...args)
  }

  addLink () {
    const inputElement = this.linkInputRef.value

    if (inputElement == null) return

    inputElement.className += " link-validate"
    const href = inputElement.value

    try {
      new URL(href)
      inputElement.setCustomValidity("")
    } catch(error) {
      inputElement.setCustomValidity("Not a valid URL")
      return
    }

    if (href) {
      this.closeLinkDialog()
      inputElement.value = ""
      let chain = this.editor.chain().focus().extendMarkRange('link').setLink({ href })

      if (this.editor.state.selection.empty) {
        chain.insertContent(href)
      }

      chain.run()
    }
  }

  render () {
    return html`
      <div class="toolbar" part="toolbar" role="tablist">
        <button
          class="toolbar__button"
          part=${`${this.toolbarButtonParts("bold")} ${this.disabledButton("toggleBold")}`}
          title="Bold"
          aria-disabled=${!this.can("toggleBold")}
          @click=${() => this.run("toggleBold")}
        >
          ${this.icons.bold}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${`${this.toolbarButtonParts("italic")} ${this.disabledButton("toggleItalic")}`}
          title="Italics"
          aria-disabled=${!this.can("toggleItalic")}
          @click=${() => this.run("toggleItalic")}
        >
          ${this.icons.italics}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("strike")}
          title="Strikethrough"
          aria-disabled=${!this.can("toggleStrike")}
          @click=${() => this.run("toggleStrike")}
        >
          ${this.icons.strikeThrough}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          title="Link"
          part=${this.toolbarButtonParts("link")}
          aria-disabled=${!this.can("toggleLink")}
          @click=${() => {
            if (this.ariaDisabled === "true") return
            this.showLinkDialog()
          }}
        >
          ${this.icons.link}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("heading", { level: 1 })}
          title="Heading"
          aria-disabled=${!this.can("toggleHeading", { level: 1 })}
          @click=${() => this.run("toggleHeading", { level: 1 })}
        >
          ${this.icons.heading}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("blockquote")}
          title="Quote"
          aria-disabled=${!this.can("toggleBlockquote")}
          @click=${() => this.run("toggleBlockquote")}
        >
          ${this.icons.quote}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("code")}
          title="Code"
          aria-disabled=${!this.can("toggleBlockquote")}
          @click=${() => this.run("toggleCode")}
        >
          ${this.icons.code}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("bulletList")}
          title="Bullets"
          aria-disabled=${!this.can("toggleBulletList")}
          @click=${() => this.run("toggleBulletList")}
        >
          ${this.icons.bullets}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("orderedList")}
          title="Numbers"
          aria-disabled=${!this.can("toggleOrderedList")}
          @click=${() => this.run("toggleOrderedList")}>
          ${this.icons.numbers}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("files")}
          title="Attach Files"
          aria-disabled=${this.editor == null}
          @click=${async () => await this.attachFiles()}
        >
          ${this.icons.files}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("undo")}
          title="Undo"
          aria-disabled=${!this.can("undo")}
          @click=${() => this.run("undo")}
        >
          ${this.icons.undo}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("redo")}
          title="Redo"
          aria-disabled=${!this.can("redo")}
          @click=${() => this.run("redo")}
        >
         ${this.icons.redo}
        </button>
      </div>

      <div ${ref(this.editorElementChanged)} style="position: relative;">
        <div class="link-dialog" hidden @click=${(event) => {
          if (event.currentTarget.contains(event.target) && event.currentTarget !== event.target) {
            return
          }

          this.closeLinkDialog()
        }}>
          <div class="link-dialog__container">
            <input
              id="link-dialog__input"
              class="link-dialog__input"
              type="text"
              placeholder="Enter a URL..."
              aria-label="Enter a URL"
              required
              type="url"
              ${ref(this.linkInputRef)}
              @input=${() => {
                const inputElement = this.linkInputRef.value
                if (inputElement == null) return
                inputElement.setCustomValidity("")
              }}
              @blur=${() => {
              }}
              @keydown=${(e) => {
                if (e.key.toLowerCase() === "enter") {
                  e.preventDefault()
                  this.addLink()
                }
              }}
            >
            <div class="link-dialog__buttons">
              <button class="link-dialog__button" @click=${this.addLink}>Link</button>
              <button class="link-dialog__button" aria-disabled=${() => {}} @click=${() => {
                editor.chain().focus().extendMarkRange('link').unsetLink().run()
              }}>Unlink</button>
            </div>
          </div>
        </div>
      </div>
    `
  }
}

export default TipTapElement
