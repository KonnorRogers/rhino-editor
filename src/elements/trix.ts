import { tipTapCoreStyles } from "../styles/tip-tap-core-styles"
import { Editor } from '@tiptap/core'
// https://tiptap.dev/api/extensions/starter-kit#included-extensions
import StarterKit from '@tiptap/starter-kit'
import Link from "@tiptap/extension-link"
import Focus from "@tiptap/extension-focus";
import Placeholder from "@tiptap/extension-placeholder"

import { css, CSSResult, html, LitElement, PropertyDeclarations, PropertyValueMap, TemplateResult } from 'lit'
import { ref, createRef, Ref } from 'lit/directives/ref.js';
import "role-components"

import { AttachmentUpload, AttachmentManager } from "../attachment-upload"
import Attachment from '../attachment'
import * as icons from '../icons'
import { normalize } from '../styles/normalize'
import type { Maybe } from '../types'

export const isiOS = /Mac|iOS|iPhone|iPad|iPod/i.test(window.navigator.platform)

export const modifierKey = isiOS ? "cmd" : "ctrl"

export const config = {
  bold: `Bold <${modifierKey}+b>`,
  italics: `Italicize <${modifierKey}+i>`,
  strike: `Strikethrough <${modifierKey}+shift+x>`,
  link: `Link <${modifierKey}+k>`,
  heading: `Heading <${modifierKey}+alt+1>`,
  blockQuote: `Blockquote <${modifierKey}+b>`,
  code: `Code <${modifierKey}+e>`,
  bulletList: `Bullet List <${modifierKey}+shift+7>`,
  orderedList: `Ordered List <${modifierKey}+shift+8>`,
  files: `Attach Files`,
  undo: `Undo <${modifierKey}+z>`,
  redo: `Redo <${modifierKey}+shift+z>`,
  linkDialogLink: `Link`,
  linkDialogUnlink: `Unlink`
}

export class TipTapAddAttachmentEvent extends Event {
  attachment: AttachmentManager

  static get eventName (): "tip-tap-add-attachment" {
    return "tip-tap-add-attachment"
  }

  constructor (attachment: AttachmentManager, options: Partial<EventInit> = {}) {
    if (options.bubbles == null) options.bubbles = true
    if (options.composed == null) options.composed = true
    if (options.cancelable == null) options.cancelable = true

    super(TipTapAddAttachmentEvent.eventName, options);
    this.attachment = attachment
  }
}

export type ToolbarButton<T extends string> =
| `button button__${T}`
| `button button__${T} button--active`

export class TipTapElement extends LitElement {
  readonly: boolean = false;
  linkInputRef: Ref<HTMLInputElement> = createRef()
  linkDialogExpanded: boolean = false
  input: Maybe<string>
  editor: Maybe<Editor>
  editorElement: Maybe<Element>

  static get properties (): PropertyDeclarations {
    return {
      readonly: {type: Boolean, reflect: true},
      editor: {},
      editorElement: {},
      linkDialogExpanded: {type: Boolean},
      input: {},
      linkInputRef: {}
    }
  }

  static get styles (): CSSResult {
    return css`
      ${normalize}
      ${tipTapCoreStyles}

      :host {
        display: block;
        --border-color: #cecece;
        --placeholder-text-color: #cecece;
        --input-focus-ring: 0 0 2px 1px #005a9c;

        --active-button-background-color: rgb(226 239 255);

        --button-text-color: #889;
        --button-border-color: #005a9c;
        --button-background-color: hsl(219, 26%, 95%);

        --disabled-button-text-color: #d1d5db;
        --disabled-button-border-color: #d1d5db;
        --disabled-button-background-color: #d1d5db;

        --toolbar-text-color: hsl(219, 6%, 43%);

        --link-dialog-border-color: #005a9c;
        --link-dialog-background-color: hsla(219, 26%, 95%, 0.5);

        --link-dialog-input-invalid-background-color: #ffdddd;
        --link-dialog-input-invalid-border-color: red;

        color: #374151;
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

      .ProseMirror .placeholder {
        position: absolute;
        pointer-events: none;
        color: var(--placeholder-text-color);
        cursor: text;
        content: "";
      }

      .ProseMirror {
        border: 1px solid var(--border-color);
        border-radius: 3px;
        margin: 0;
        padding: 0.4em 0.6em;
        min-height: 200px;
        outline: transparent;
      }

      .toolbar {
        color: var(--toolbar-text-color);
        overflow: auto;
      }

      .toolbar__button {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 32px;
        margin-right: -3px;
        min-width: 32px;
        position: relative;
        border: 1px solid var(--border-color);
        border-radius: 4px;
      }

      .toolbar__button[aria-disabled="true"] {
        color: var(--disabled-button-text-color);
        border-color: var(--disabled-button-border-color);
      }

      .toolbar__button[aria-disabled="true"]:focus {
        border-color: var(--disabled-button-border-color);
      }

      .toolbar__button svg {
        flex-shrink: 0;
        height: 24px;
        width: 24px;
      }

      button:is(:focus, :hover):not([aria-disabled="true"], :disabled) {
        outline: transparent;
        box-shadow: 0 0 0 1px var(--button-border-color);
        border-color: var(--button-border-color);
        background-color: var(--button-background-color);
      }

      .toolbar__button:is([aria-disabled="true"]:not([part~="button--active"])) {
        color: var(--disabled-button-text-color);
        border-color: var(--disabled-button-border-color);
      }

      .toolbar__button:is(:focus, :hover):is([aria-disabled="true"]:not([part~="button--active"])) {
        outline: transparent;
        color: var(--disabled-button-text-color);
        border-color: var(--disabled-button-border-color);
        box-shadow: 0 0 0 1px var(--disabled-button-border-color);
      }

      .toolbar__button:is([part~="button--active"]),
      .toolbar__button:is([part~="button--active"]):is(:hover, :focus) {
        background-color: var(--active-button-background-color);
      }

      .toolbar__button:is([part~="button__link"], [part~="button__orderedList"]) {
        margin-right: 1rem;
      }

      .toolbar__button[part~="button__files"] {
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

      .link-dialog__input {
        border: 1px solid #374151;
        border-radius: 4px;
        padding: 0.4em 0.6em;
        flex: 1 1 auto;
      }

      .link-dialog__input:is(:focus) {
        outline: transparent;
        box-shadow: var(--input-focus-ring);
        border-color: var(--link-dialog-border-color);
        background-color: var(--link-dialog-background-color);
      }

      .link-validate:invalid {
        outline: transparent;
        background-color: var(--link-dialog-input-invalid-background-color);
        border-color: var(--link-dialog-input-invalid-border-color);
        box-shadow: none;
      }

      .link-dialog__button {
        padding: 0.4em 0.6em;
        border: 1px solid var(--button-border-color);
        border-radius: 4px;
      }

      .link-dialog__buttons {
        margin-right: 0.5em;
        margin-left: 0.5em;
      }

      /* Attachments */
      figure.has-focus {
        outline: transparent;
        box-shadow: 0 0 0 2px var(--button-border-color);
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

  connectedCallback (): void {
    super.connectedCallback()

    addEventListener(TipTapAddAttachmentEvent.eventName, (event: TipTapAddAttachmentEvent) => {
      const { attachment, target } = event

      if (target instanceof HTMLElement && attachment.file) {
        const upload = new AttachmentUpload(attachment, target)
        upload.start()
      }
    })

    this.addEventListener("keydown", (e) => {
      let { key, metaKey, ctrlKey } = e

      if (key == null) return

      key = key.toLowerCase()

      if (key === "escape" && this.linkDialogExpanded) {
        this.closeLinkDialog()
        return
      }

      const shortcutModifier = isiOS ? metaKey : ctrlKey

      if (key === "k" && shortcutModifier) {
        this.showLinkDialog()
      }
    })
  }

  get icons (): typeof icons {
    return icons
  }

  updated(changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    if (changedProperties.has("readonly")) {
      this.editor?.setEditable(!this.readonly)
    }
  }

  editorElementChanged (element: Element | undefined): void {
    if (element == null) return
    // Non-light-dom version.
    // const div = document.createElement("div")
    // this.insertAdjacentElement("afterend", div)
    this.editor = this.setupEditor(element)
    this.editorElement = element
  }


  activeButton (action: string, ...args: any[]): "" | "button--active" {
    return this.editor?.isActive(action, ...args) ? "button--active" : ""
  }

  isDisabled (action: string, ...args: any[]) {
    if (this.editor == null) return false

    // Cannot do code + bold / strike / italic
    if (["toggleBold", "toggleStrike", "toggleItalic", "setLink"].includes(action)) {
      if (this.editor.isActive("code")) return true
    }

    return !this.can(action, ...args)
  }

  disabledButton (action: string, ...args: any[]): "" | "button--disabled" {
    return this.isDisabled(action, ...args) ? "button--disabled" : ""
  }

  pressedButton (action: string, ...args: any[]): "true" | "false" {
    return this.editor?.isActive(action, ...args) ? "true" : "false"
  }

  setupEditor (element: Element): Editor {
    return new Editor({
      element,
      injectCSS: false,
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
        }),
      ],
      content: this.inputElement?.value,
      autofocus: true,
      editable: !this.readonly,
      // onBeforeCreate: ({ editor }) => {
      //   // Before the view is created.
      // },
      onCreate: (_args) => {
        // The editor is ready.
        this.requestUpdate()
      },
      onUpdate: (_args) => {
        // The content has changed.
        if (this.inputElement && this.editor) {
          this.inputElement.value = this.editor.getHTML()
        }
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
        if (this.inputElement && this.editor) {
          this.inputElement.value = this.editor.getHTML()
        }
        this.requestUpdate()
      },
      // onDestroy: () => {
      //   // The editor is being destroyed.
      // },
    })
  }

  get inputElement (): Maybe<HTMLInputElement> {
    if (this.input == null) return undefined

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

    const inputElement = this.linkInputRef.value

    if (inputElement != null) {
      inputElement.classList.remove("link-validate")
      inputElement.value = ""
    }

    this.linkDialogExpanded = true
    this.linkDialog.removeAttribute("hidden")
    setTimeout(() => {
      if (inputElement) inputElement.focus()
    })
  }

  get linkDialog (): Maybe<HTMLAnchorElement>  {
    return this.shadowRoot?.querySelector(".link-dialog") as Maybe<HTMLAnchorElement>
  }

  run (action: string, ...args: any[]) {
    if (this.isDisabled(action, ...args) === true) {
      return
    }

    // @ts-expect-error
    this.editor?.chain().focus()[action](...args).run() && this.requestUpdate()
  }

  toolbarButtonParts<T extends string> (actionName: T, ...args: any[]): ToolbarButton<T> {
    const active = this.activeButton(actionName, ...args)
    let str: ToolbarButton<T> = `button button__${actionName}`

    if (active) {
      str += ` button--active`
    }

    return str as ToolbarButton<T>
  }

  handleFileUpload (): Promise<void> {
    const input = this.fileInputEl

    return new Promise((resolve, _reject) => {
      if (input == null) {
        resolve()
        return
      }

      const files = input.files
      if (files == null || files.length === 0) return

      const attachments: AttachmentManager[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        if (file == null) return
        const src = URL.createObjectURL(file);

        const attachment: AttachmentManager = new AttachmentManager({
          src,
          file,
        }, this)

        attachments.push(attachment)
      }

      if (this.editor == null) {
        resolve()
        return
      }

      const chain = this.editor.chain().focus()
      chain.setAttachment(attachments)
      chain.run()

      attachments.forEach((attachment) => {
        this.dispatchEvent(new TipTapAddAttachmentEvent(attachment))
      })

      resolve()
    })
  }

  get fileInputEl(): Maybe<HTMLInputElement> {
    return this.shadowRoot?.getElementById("file-input") as Maybe<HTMLInputElement>
  }

  attachFiles (): void {
    const input = this.fileInputEl

    if (input == null) return

    input.click()
  }

  can (action: string, ...args: any[]): boolean {
    // @ts-expect-error
    return this.editor && this.editor.can()[action]?.(...args)
  }

  addLink (): void {
    const inputElement = this.linkInputRef.value

    if (inputElement == null) return

    const href = inputElement.value

    try {
      new URL(href)
      inputElement.setCustomValidity("")
    } catch(error) {
      inputElement.setCustomValidity("Not a valid URL")
      inputElement.classList.add("link-validate")
      return
    }

    if (href) {
      this.closeLinkDialog()
      inputElement.value = ""
      let chain = this.editor?.chain().focus().extendMarkRange('link').setLink({ href })

      if (this.editor?.state.selection.empty) {
        chain?.insertContent(href)
      }

      chain?.run()
    }
  }

  renderToolbar () {
    if (this.readonly) return html``

    return html`
      <role-toolbar class="toolbar" part="toolbar" role="toolbar" style="padding: 4px;">
        <button
          class="toolbar__button"
          part=${this.toolbarButtonParts("bold") + " " + this.disabledButton("toggleBold")}
          aria-describedby="bold"
          aria-disabled=${this.isDisabled("toggleBold")}
          aria-pressed=${this.pressedButton("bold")}
          data-role="toolbar-item"
          @click=${() => this.run("toggleBold")}
        >
          <role-tooltip id="bold" hoist .rootElement=${this.shadowRoot}>${config.bold}</role-tooltip>
          ${this.icons.bold}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("italic") + " " + this.disabledButton("toggleItalic")}
          aria-describedby="italics"
          aria-disabled=${this.isDisabled("toggleItalic")}
          aria-pressed=${this.pressedButton("italic")}
          data-role="toolbar-item"
          @click=${() => this.run("toggleItalic")}
        >
          <role-tooltip id="italics" hoist .rootElement=${this.shadowRoot}>${config.italics}</role-tooltip>
          ${this.icons.italics}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("strike") + " " + this.disabledButton("toggleStrike")}
          aria-describedby="strikethrough"
          aria-disabled=${this.isDisabled("toggleStrike")}
          aria-pressed=${this.pressedButton("strike")}
          data-role="toolbar-item"
          @click=${() => this.run("toggleStrike")}
        >
          <role-tooltip id="strikethrough" hoist .rootElement=${this.shadowRoot}>${config.strike}</role-tooltip>
          ${this.icons.strikeThrough}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          aria-describedby="link"
          part=${this.toolbarButtonParts("link") + " " + this.disabledButton("setLink")}
          aria-disabled=${this.isDisabled("setLink")}
          aria-expanded=${this.linkDialogExpanded}
          aria-controls="link-dialog"
          data-role="toolbar-item"
          @click=${() => {
            if (this.isDisabled("setLink") === true) return
            this.toggleLinkDialog()
          }}
        >
          <role-tooltip id="link" hoist .rootElement=${this.shadowRoot}>${config.link}</role-tooltip>
          ${this.icons.link}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("heading", { level: 1 }) + " " + this.disabledButton("toggleHeading", { level: 1 })}
          aria-describedby="heading"
          aria-disabled=${this.isDisabled("toggleHeading", { level: 1 })}
          aria-pressed=${this.pressedButton("toggleHeading", { level: 1 })}
          data-role="toolbar-item"
          @click=${() => this.run("toggleHeading", { level: 1 })}
        >
          <role-tooltip id="heading" hoist .rootElement=${this.shadowRoot}>${config.heading}</role-tooltip>
          ${this.icons.heading}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("blockquote") + " " + this.disabledButton("toggleBlockquote")}
          aria-describedby="blockquote"
          aria-disabled=${this.isDisabled("toggleBlockquote")}
          aria-pressed=${this.pressedButton("blockquote")}
          data-role="toolbar-item"
          @click=${() => this.run("toggleBlockquote")}
        >
          <role-tooltip id="blockquote" hoist .rootElement=${this.shadowRoot}>${config.blockQuote}</role-tooltip>
          ${this.icons.quote}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("code") + " " + this.disabledButton("toggleCode")}
          aria-describedby="code"
          aria-disabled=${this.isDisabled("toggleCode")}
          aria-pressed=${this.pressedButton("code")}
          data-role="toolbar-item"
          @click=${() => this.run("toggleCode")}
        >
          <role-tooltip id="code" hoist .rootElement=${this.shadowRoot}>${config.code}</role-tooltip>
          ${this.icons.code}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("bulletList") + " " + this.disabledButton("toggleBulletList")}
          aria-describedby="bullets"
          aria-disabled=${this.isDisabled("toggleBulletList")}
          aria-pressed=${this.pressedButton("bulletList")}
          data-role="toolbar-item"
          @click=${() => this.run("toggleBulletList")}
        >
          <role-tooltip id="bullets" hoist .rootElement=${this.shadowRoot}>${config.bulletList}</role-tooltip>
          ${this.icons.bullets}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("orderedList") + " " + this.disabledButton("toggleOrderedList")}
          aria-describedby="ordered-list"
          aria-disabled=${this.isDisabled("toggleOrderedList")}
          aria-pressed=${this.pressedButton("orderedList")}
          data-role="toolbar-item"
          @click=${() => this.run("toggleOrderedList")}
        >
          <role-tooltip id="ordered-list" hoist .rootElement=${this.shadowRoot}>${config.orderedList}</role-tooltip>
          ${this.icons.numbers}
        </button>

        <button
          class="toolbar__button toolbar__button--attach-files"
          tabindex="-1"
          part=${this.toolbarButtonParts("files")}
          aria-describedby="attach-files"
          aria-disabled=${this.editor == null}
          data-role="toolbar-item"
          @click=${this.attachFiles}
        >
          <role-tooltip id="attach-files" hoist .rootElement=${this.shadowRoot}>${config.files}</role-tooltip>
          ${this.icons.files}

          <input id="file-input" type="file" hidden multiple @change=${async () => await this.handleFileUpload()}>
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("undo") + " " + this.disabledButton("undo")}
          aria-describedby="undo"
          aria-disabled=${this.isDisabled("undo")}
          data-role="toolbar-item"
          @click=${() => this.run("undo")}
        >
          <role-tooltip id="undo" hoist .rootElement=${this.shadowRoot}>${config.undo}</role-tooltip>
          ${this.icons.undo}
        </button>

        <button
          class="toolbar__button"
          tabindex="-1"
          part=${this.toolbarButtonParts("redo") + " " + this.disabledButton("redo")}
          aria-describedby="redo"
          aria-disabled=${this.isDisabled("redo")}
          data-role="toolbar-item"
          @click=${() => this.run("redo")}
        >
          <role-tooltip id="redo" hoist .rootElement=${this.shadowRoot}>${config.redo}</role-tooltip>
          ${this.icons.redo}
        </button>
      </role-toolbar>`
  }

  renderLinkCreationDialog (): TemplateResult {
    if (this.readonly) return html``
    return html`
      <div id="link-dialog" class="link-dialog" hidden @click=${(event: MouseEvent) => {
        if ((event.currentTarget as HTMLElement).contains(event.target as HTMLElement) && event.currentTarget !== event.target) {
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

              if (inputElement == null) return

              inputElement.classList.remove("link-validate")
              // inputElement.value = ""
            }}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key?.toLowerCase() === "enter") {
                e.preventDefault()
                this.addLink()
              }
            }}
          >
          <div class="link-dialog__buttons">
            <button class="link-dialog__button" @click=${this.addLink}>${config.linkDialogLink}</button>
            <button class="link-dialog__button" @click=${() => {
              this.editor?.chain().focus().extendMarkRange('link').unsetLink().run()
            }}>${config.linkDialogUnlink}</button>
          </div>
        </div>
      </div>`
  }

  render (): TemplateResult {
    return html`
      ${this.renderToolbar()}
      <div ${ref(this.editorElementChanged)} style="position: relative;">
        ${this.renderLinkCreationDialog()}
      </div>
    `
  }
}

declare global {
  interface WindowEventMap {
    [TipTapAddAttachmentEvent.eventName]: TipTapAddAttachmentEvent
  }
}

export default TipTapElement
