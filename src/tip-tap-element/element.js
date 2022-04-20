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
        --border-color: #cecece;
        color: #374151;
      }

      :where(.ProseMirror .placeholder::before) {
        position: absolute;
        pointer-events: none;
        color: #cecece;
        cursor: text;
        content: "";
      }

      :where(.ProseMirror) {
        border: 1px solid var(--border-color);
        border-radius: 3px;
        margin: 0;
        padding: 0.4em 0.6em;
        min-height: 200px;
        outline: none;
      }

      :where(.toolbar) {
        padding-inline: 3px;
        padding-block: 1rem;
        display: flex;
        overflow-x: auto;
        align-items: center;
        color: hsl(219, 6%, 43%)
      }

      svg, img, figure {
        width: 100%;
        height: auto;
        display: block;
      }

      p {
        margin: 0;
        padding: 0;
      }

      button {
        background-color: white;
        border: none;
        color: inherit;
        min-width: 2.5rem;
      }

      button:is(:focus, :hover):not([aria-disabled="true"], :disabled) {
        outline: none;
        background-color: rgb(240, 240, 240);
      }

      .toolbar button {
        height: 2rem;
        contain: strict;
        padding: 0 0.4rem;
        position: relative;
        margin: -1px;
        border: 1px solid var(--border-color);
      }

      .toolbar button:is([aria-disabled="true"]:not([part*="button--active"])) {
        pointer-events: none;
        color: hsl(219, 6%, 80%);
        border-color: hsl(219, 6%, 88%);
      }

      .toolbar button:is([part*="button--active"]),
      .toolbar button:is([part*="button--active"]):is(:hover, :focus) {
        color: hsl(200, 100%, 46%);
      }

      .toolbar button:is([part*="button__link"], [part*="button__orderedList"]) {
        margin-right: 1rem;
      }

      .toolbar button[part*="button__files"] {
        margin-right: auto;
      }

      .dialog {
        position: absolute;
        z-index: 1;
        height: 100%;
        width: 100%;
        padding: 1px;
      }

      .dialog__container {
        display: flex;
        align-items: center;
        background: white;
        box-shadow: 0 0.3em 1em #ccc;
        max-width: 600px;
        padding: 0.75rem 0.4rem;
        border-radius: 8px;
        border-top: 2px solid #ccc;
      }

      .dialog__button {
        padding: 0.35em 0.5em;
        border: 1px solid gray;
        border-radius: 4px;
      }

      .dialog__buttons {
        margin-inline-start: 1em;
        margin-inline-end: 0.5em;
      }

      .dialog__input {
        padding: 0.25em 0.4em;
        flex: 1 1 auto;
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
    // const div = document.createElement("div")
    // this.insertAdjacentElement("afterend", div)
    this.editor = this.setupEditor(element)
    this.editorElement = element
  }

  activeButton (action) {
    return this.editor.isActive(action) ? "button--active" : ""
  }

  setupEditor (element) {
    return new Editor({
      element,
      extensions: [
        StarterKit,
        Link,
        Image,
      ],
      content: this.inputElement?.value,
      autofocus: true,
      editable: true,
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
        this.requestUpdate()
      },
      onTransaction: ({ editor, transaction }) => {
        // The editor state has changed.
        this.requestUpdate()
      },
      onFocus: ({ editor, event }) => {
        // The editor is focused.
        this.shadowRoot.querySelector(".ProseMirror").click()
        this.requestUpdate()
      },
      onBlur: ({ editor, event }) => {
        // The editor isn’t focused anymore.
        this.inputElement.value = this.editor.getHTML()
        this.requestUpdate()
      },
      // onDestroy: () => {
      //   // The editor is being destro?yed.
      // },
    })
  }

  get inputElement () {
    return document.getElementById(this.input)
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

  buttonParts (actionName) {
    return `button button__${actionName} ${this.activeButton(actionName)}`
  }

  showLinkDialog () {
    this.shadowRoot.querySelector(".dialog").removeAttribute("hidden")
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

  can (action, ...args) {
    return this.editor && this.editor.can()[action](...args)
  }

  render () {
    return html`
      <div class="toolbar" part="toolbar" role="tablist">
        <button
          part=${`${this.buttonParts("bold")} ${this.disabledButton("toggleBold")}`}
          title="Bold"
          aria-disabled=${!this.can("toggleBold")}
          @click=${() => this.run("toggleBold")}
        >
          ${this.icons.bold}
        </button>

        <button
          tabindex="-1"
          part=${this.buttonParts("italic")}
          title="Italics"
          aria-disabled=${!this.can("toggleItalic")}
          @click=${() => this.run("toggleItalic")}
        >
          ${this.icons.italics}
        </button>

        <button
          tabindex="-1"
          part=${this.buttonParts("strike")}
          title="Strikethrough"
          aria-disabled=${!this.can("toggleStrike")}
          @click=${() => this.run("toggleStrike")}
        >
          ${this.icons.strikeThrough}
        </button>

        <button
          tabindex="-1"
          title="Link"
          part=${this.buttonParts("link")}
          aria-disabled=${!this.can("toggleLink")}
          @click=${() => {
            if (this.ariaDisabled === "true") return
            this.showLinkDialog()
          }}
        >
          ${this.icons.link}
        </button>

        <button
          tabindex="-1"
          part=${this.buttonParts("heading", { level: 1 })}
          title="Heading"
          aria-disabled=${!this.can("toggleHeading", { level: 1 })}
          @click=${() => this.run("toggleHeading", { level: 1 })}
        >
          ${this.icons.heading}
        </button>

        <button
          tabindex="-1"
          part=${this.buttonParts("blockquote")}
          title="Quote"
          aria-disabled=${!this.can("toggleBlockquote")}
          @click=${() => this.run("toggleBlockquote")}
        >
          ${this.icons.quote}
        </button>

        <button
          tabindex="-1"
          part=${this.buttonParts("code")}
          title="Code"
          aria-disabled=${!this.can("toggleBlockquote")}
          @click=${() => this.run("toggleCode")}
        >
          ${this.icons.code}
        </button>

        <button
          tabindex="-1"
          part=${this.buttonParts("bulletList")}
          title="Bullets"
          aria-disabled=${!this.can("toggleBulletList")}
          @click=${() => this.run("toggleBulletList")}
        >
          ${this.icons.bullets}
        </button>

        <button
          tabindex="-1"
          part=${this.buttonParts("orderedList")}
          title="Numbers"
          aria-disabled=${!this.can("toggleOrderedList")}
          @click=${() => this.run("toggleOrderedList")}>
          ${this.icons.numbers}
        </button>

        <button
          tabindex="-1"
          part=${this.buttonParts("files")}
          title="Attach Files"
          aria-disabled=${this.editor == null}
          @click=${async () => await this.attachFiles()}
        >
          ${this.icons.files}
        </button>

        <button
          tabindex="-1"
          part=${this.buttonParts("undo")}
          title="Undo"
          aria-disabled=${!this.can("undo")}
          @click=${() => this.run("undo")}
        >
          ${this.icons.undo}
        </button>

        <button
          tabindex="-1"
          part=${this.buttonParts("redo")}
          title="Redo"
          aria-disabled=${!this.can("redo")}
          @click=${() => this.run("redo")}
        >
          ${this.icons.redo}
        </button>
      </div>


      <div ${ref(this.editorElementChanged)} style="position: relative;">
        <div class="dialog" hidden @click=${() => this.shadowRoot.querySelector(".dialog").setAttribute("hidden", "")}>
          <div class="dialog__container">
            <input class="dialog__input" type="text" placeholder="Enter a URL..." aria-label="Enter a URL">
            <div class="dialog__buttons">
              <button class="dialog__button" @click=${() => {
                const href = this.shadowRoot.querySelector(".dialog__input").value
                if (href) {
                  this.shadowRoot.querySelector(".dialog").setAttribute("hidden", "")
                  this.editor.chain().focus().toggleLink({ href }).run()
                }
              }}>Link</button>
              <button class="dialog__button">Unlink</button>
            </div>
          </div>
        </div>
      </div>
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
