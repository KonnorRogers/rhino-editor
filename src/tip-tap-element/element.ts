import { tipTapCoreStyles } from "./tip-tap-core-styles"
import { Editor } from '@tiptap/core'

// https://tiptap.dev/api/extensions/starter-kit#included-extensions
import StarterKit from '@tiptap/starter-kit'
import Link from "@tiptap/extension-link"
import Focus from "@tiptap/extension-focus";
import Placeholder from "@tiptap/extension-placeholder"

import { css, CSSResult, html, LitElement, PropertyDeclarations, TemplateResult } from 'lit'
import { ref, createRef, Ref } from 'lit/directives/ref.js';

import Attachment from './attachment'
import { makeElement } from './make-element'
import { toMemorySize } from './toMemorySize'
import * as icons from './icons'
import { normalize } from '../normalize'
import type { Maybe } from './types'
// import { DirectUploader } from "./direct-uploader"

export type ToolbarButton<T extends string> =
| `button button__${T}`
| `button button__${T} button--disabled`
| `button button__${T} button--active`
| `button button__${T} button--active button--disabled`

export class TipTapElement extends LitElement {
  linkInputRef: Ref<HTMLInputElement>
  linkDialogExpanded: boolean
  input: string
  editor: Editor
  editorElement: HTMLElement

  static get properties (): PropertyDeclarations {
    return {
      editor: {state: true},
      editorElement: {state: true},
      linkDialogExpanded: {type: Boolean},
      input: {},
      linkInputRef: {state: true}
    }
  }

  static get styles (): CSSResult {
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
        padding: 0;
        margin: 0;
      }

      figure {
        position: relative;
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
      figure.has-focus {
        box-shadow: 0 0 0 2px skyblue;
      }

      attachment-editor {
        display: none;
      }

      .ProseMirror[contenteditable="true"] figure.has-focus attachment-editor {
        display: flex;
      }

      figcaption {
        position: relative;
      }

      .ProseMirror p.is-editor-empty:first-child::before,
      figcaption p:first-child.is-empty::before {
        color: #adb5bd;
        content: attr(data-placeholder);
      }

      figcaption p:first-child.is-empty::before {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        cursor: text;
      }

      .ProseMirror p.is-editor-empty:first-child::before {
        float: left;
        height: 0;
        pointer-events: none;
      }

    `
  }

  static get icons (): typeof icons {
    return icons
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.addEventListener("keydown", (e) => {
      if (e.key.toLowerCase() === "escape" && this.linkDialogExpanded) {
        this.closeLinkDialog()
      }
    })
  }

  get icons (): typeof icons {
    // @ts-expect-error
    return this.constructor.icons
  }

  constructor () {
    super()
    this.linkInputRef = createRef();
  }

  editorElementChanged (element: HTMLElement): void {
    // Non-light-dom version.
    // const div = document.createElement("div")
    // this.insertAdjacentElement("afterend", div)
    this.editor = this.setupEditor(element)
    this.editorElement = element
  }

  activeButton (action: string, ...args: any[]): "" | "button--active" {
    return this.editor?.isActive(action, ...args) ? "button--active" : ""
  }

  disabledButton (action: string, ...args: any[]): "" | "button--disabled" {
    return this.can(action, ...args) ? "" : "button--disabled"
  }

  pressedButton (action: string, ...args: any[]): "true" | "false" {
    return this.editor?.isActive(action, ...args) ? "true" : "false"
  }

  setupEditor (element: HTMLElement): Editor {
    return new Editor({
      element,
      extensions: [
        StarterKit,
        Link,
        Attachment,
        Focus,
        Placeholder.configure({
          includeChildren: true,
          // Use a placeholder:
          placeholder: ({ editor, pos }) => {
            if (editor.state.doc.resolve(pos).parent.type.name === "attachment-figure") {
              return "Add a caption..."
            }
            return "Write something..."
          }
        })
      ],
      content: this.inputElement?.value,
      autofocus: true,
      editable: true,
      // onBeforeCreate: ({ editor }) => {
      //   // Before the view is created.
      // },
      onCreate: (_args) => {
        // The editor is ready.
        this.requestUpdate()
      },
      onUpdate: (_args) => {
        // The content has changed.
        this.inputElement.value = this.editor.getHTML()
        this.requestUpdate()
      },
      onSelectionUpdate: (_args) => {
        // The selection has changed.
        this.requestUpdate()
      },
      onTransaction: (_args) => {
        // The editor state has changed.
        this.requestUpdate()
      },
      onFocus: (_args) => {
        // The editor is focused.
        this.closeLinkDialog()
        this.requestUpdate()
      },
      onBlur: (_args) => {
        // The editor isn’t focused anymore.
        this.inputElement.value = this.editor.getHTML()
        this.requestUpdate()
      },
      // onDestroy: () => {
      //   // The editor is being destroyed.
      // },
    })
  }

  get inputElement (): Maybe<HTMLInputElement> {
    return document.getElementById(this.input) as Maybe<HTMLInputElement>
  }

  toggleLinkDialog (): void {
    if (this.linkDialogExpanded) {
      this.closeLinkDialog()
      return
    }

    this.showLinkDialog()
  }

  closeLinkDialog (): void {
    if (this.linkDialog == null) return

    this.linkDialogExpanded = false
    this.linkDialog.setAttribute("hidden", "")
  }

  showLinkDialog (): void {
    if (this.linkDialog == null) return

    this.linkDialogExpanded = true
    this.linkDialog.removeAttribute("hidden")
  }

  get linkDialog (): Maybe<HTMLAnchorElement>  {
    return this.shadowRoot.querySelector(".link-dialog")
  }

  run (action: string, ...args: any[]) {
    if (this.ariaDisabled === "true") return

    this.editor.chain().focus()[action](...args).run() && this.requestUpdate()
  }

  toolbarButtonParts<T extends string> (actionName: T, ...args: any[]): ToolbarButton<T> {
    const disabled = this.disabledButton("toggle" + capitalize(actionName), ...args)
    const active = this.activeButton(actionName)

    let str = `button button__${actionName}`

    if (active) {
      str += ` ${active}`
    }

    if (disabled) {
      str += ` ${disabled}`
    }


    return str as ToolbarButton<T>
  }

  attachFiles (): Promise<void> {
    return new Promise((resolve, _reject) => {
      const input = makeElement("input", { type: "file", multiple: true, hidden: true })

      input.addEventListener("change", () => {
        const files = input.files
        const attachments = []
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const src = URL.createObjectURL(file);

          const attachment = {
            src,
            file,
            contentType: file.type,
            fileName: file.name,
            fileSize: file.size,
            caption: `${file.name} ${toMemorySize(file.size)}`
          }

          attachments.push(attachment)
        }

        const chain = this.editor.chain().focus()
        chain.setAttachment(attachments)
        chain.run()
        input.remove()
        resolve()
      })

      document.body.appendChild(input)
      input.click()
    })
  }

  can (action: string, ...args: any[]): boolean {
    return this.editor && this.editor.can()[action]?.(...args)
  }

  addLink (): void {
    const inputElement = this.linkInputRef.value

    if (inputElement == null) return

    inputElement.classList.add("link-validate")
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

  render (): TemplateResult {
    return html`
      <div class="toolbar" part="toolbar" role="toolbar">
        <button
          class="toolbar__button"
          part=${this.toolbarButtonParts("bold")}
          title="Bold"
          aria-disabled=${!this.can("toggleBold")}
          aria-pressed=${this.pressedButton("bold")}
          @click=${() => this.run("toggleBold")}
        >
          ${this.icons.bold}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("italic")}
          title="Italics"
          aria-disabled=${!this.can("toggleItalic")}
          aria-pressed=${this.pressedButton("italic")}
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
          aria-pressed=${this.pressedButton("strike")}
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
          aria-pressed=${this.pressedButton("link")}
          @click=${() => {
            if (this.ariaDisabled === "true") return
            this.toggleLinkDialog()
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
          aria-pressed=${this.pressedButton("link", { level: 1 })}
          @click=${() => this.run("toggleHeading", { level: 1 })}
        >
          ${this.icons.heading}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("blockquote") }
          title="Quote"
          aria-disabled=${!this.can("toggleBlockquote")}
          aria-pressed=${this.pressedButton("link")}
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
          aria-pressed=${this.pressedButton("code")}
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
          aria-pressed=${this.pressedButton("bulletList")}
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
          aria-pressed=${this.pressedButton("orderedList")}
          @click=${() => this.run("toggleOrderedList")}
        >
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
                const inputElement = this.linkInputRef.value
                inputElement.classList.remove("link-validate")
                inputElement.value = ""
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
                this.editor.chain().focus().extendMarkRange('link').unsetLink().run()
              }}>Unlink</button>
            </div>
          </div>
        </div>
      </div>
    `
  }
}

function capitalize<T extends string> (str: T): Capitalize<T> {
  return str.charAt(0).toUpperCase() + str.slice(1) as Capitalize<T>
}

export default TipTapElement
