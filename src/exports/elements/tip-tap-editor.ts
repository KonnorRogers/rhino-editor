import { Content, Editor, EditorOptions } from "@tiptap/core";
import { tipTapCoreStyles } from "../styles/tip-tap-core-styles";
// https://tiptap.dev/api/extensions/starter-kit#included-extensions
import StarterKit, { StarterKitOptions } from "@tiptap/starter-kit";
import {
  RhinoStarterKit,
  RhinoStarterKitOptions,
} from "src/exports/extensions/rhino-starter-kit";
import { isiOS, translations } from "src/exports/translations";
import { stringMap } from "src/internal/string-map";

import {
  CSSResult,
  html,
  PropertyDeclarations,
  PropertyValueMap,
  TemplateResult,
} from "lit";
import { ref, createRef, Ref } from "lit/directives/ref.js";

/** Imports <role-tooltip> and <role-toolbar> */
import { RoleToolbar } from "role-components/dist/toolbar/component";
import { RoleTooltip } from "role-components/dist/tooltip/component";

import { AttachmentUpload } from "src/exports/attachment-upload";
import { AttachmentManager } from "src/exports/attachment-manager";

/** This will go away in favor of lazy loaded SVGs. */
import * as icons from "src/internal/icons";

import { normalize } from "src/exports/styles/normalize";
import editorStyles from "src/exports/styles/editor";
import { BaseElement } from "src/internal/elements/base-element";

import { AddAttachmentEvent } from "src/internal/events/add-attachment-event";

import type { Maybe } from "src/types";
import { AttachmentEditor } from "./attachment-editor";

export type Serializer = "" | "html" | "json";
/**
 * This is the meat and potatoes. This is the <rhino-editor> element you'll
 *   see. This is what wraps everything into 1 coherent element.
 * @slot toolbar - By replacing this, you're now making your own toolbar.
 * @slot toolbar-start
 *
 * ## bold
 * @slot before-bold-button
 * @slot bold-button
 * @slot after-bold-button

 * ## Italic
 * @slot before-italic-button
 * @slot italic-button
 * @slot after-italic-button

 * ## Strike
 * @slot before-strike-button
 * @slot strike-button
 * @slot after-strike-button

 * ## Link
 * @slot before-link-button
 * @slot link-button
 * @slot after-link-button

 * ## Heading
 * @slot before-heading-button
 * @slot heading-button
 * @slot after-heading-button

 * ## Blockquote
 * @slot before-blockquote-button
 * @slot blockquote-button
 * @slot after-blockquote-button

 * ## Code block
 * @slot before-code-block-button
 * @slot code-block-button
 * @slot after-code-block-button

 * ## Bullet List
 * @slot before-bullet-list-button
 * @slot bullet-list-button
 * @slot after-bullet-list-button

 * ## Ordered list
 * @slot before-ordered-list-button
 * @slot ordered-list-button
 * @slot after-ordered-list-button

 * ## Attachments
 * @slot before-attach-files-button
 * @slot attach-files-button
 * @slot after-attach-files-button

 * ## Undo
 * @slot before-undo-button
 * @slot undo-button
 * @slot after-undo-button

 * ## Redo
 * @slot before-redo-button
 * @slot redo-button
 * @slot after-redo-button
 * @slot toolbar-end
 */
export class TipTapEditor extends BaseElement {
  readonly: boolean = false;
  linkInputRef: Ref<HTMLInputElement> = createRef();
  linkDialogExpanded: boolean = false;
  input: Maybe<string>;
  editor: Maybe<Editor>;
  editorElement: Maybe<Element>;
  translations = translations;
  serializer: Serializer = "";

  /** Comma separated string passed to the attach-files input. */
  accept: string = "*";

  static baseName = "rhino-editor";

  starterKit: Partial<StarterKitOptions> = {
    strike: false,
  };
  rhinoStarterKit: Partial<RhinoStarterKitOptions> = {
    placeholder: {
      placeholder: this.translations.placeholder,
    },
  };

  static get properties(): PropertyDeclarations {
    return {
      readonly: { type: Boolean, reflect: true },
      editor: { state: true },
      editorElement: { state: true },
      linkDialogExpanded: { type: Boolean },
      input: {},
      linkInputRef: { state: true },
      translations: { state: true },
      class: { reflect: true },
      accept: { reflect: true },
    };
  }

  protected willUpdate(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has("class")) {
      this.classList.add("rhino-editor");
    }
  }

  static get styles(): CSSResult[] {
    return [normalize, tipTapCoreStyles, editorStyles];
  }

  /** Used for registering things like <role-toolbar>, <role-tooltip>, <rhino-attachment-editor> */
  registerDependencies() {
    [AttachmentEditor, RoleTooltip, RoleToolbar].forEach((el) => el.define());
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.classList.add("rhino-editor");

    this.registerDependencies();

    this.addEventListener(AddAttachmentEvent.eventName, this.handleAttachment);

    this.addEventListener("keydown", this.handleKeyboardDialogToggle);
    this.addEventListener("drop", this.handleDropFile);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.removeEventListener(
      AddAttachmentEvent.eventName,
      this.handleAttachment
    );

    this.removeEventListener("keydown", this.handleKeyboardDialogToggle);
    this.removeEventListener("drop", this.handleDropFile);
  }

  handleKeyboardDialogToggle = (e: KeyboardEvent) => {
    let { key, metaKey, ctrlKey } = e;

    if (key == null) return;

    key = key.toLowerCase();

    if (key === "escape" && this.linkDialogExpanded) {
      this.closeLinkDialog();
      return;
    }

    const shortcutModifier = isiOS ? metaKey : ctrlKey;

    if (key === "k" && shortcutModifier) {
      this.showLinkDialog();
    }
  };

  handleAttachment = (event: AddAttachmentEvent) => {
    const { attachment, target } = event;

    if (target instanceof HTMLElement && attachment.file) {
      // if (attachment.attributes.sgid) return
      const upload = new AttachmentUpload(attachment, target);
      upload.start();
    }
  };

  get icons(): typeof icons {
    return icons;
  }

  updated(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    if (changedProperties.has("readonly")) {
      this.editor?.setEditable(!this.readonly);
    }
  }

  editorElementChanged(element: Element | undefined): void {
    if (element == null) return;

    if (this.editor) {
      this.#unBindEditorListeners();
    }
    // light-dom version.
    const div = document.createElement("div");
    this.insertAdjacentElement("beforeend", div);
    div.setAttribute("slot", "editor");
    this.editor = this.#setupEditor(div);
    this.#bindEditorListeners();
    this.editorElement = div.querySelector(".ProseMirror");

    this.editorElement?.classList.add("trix-content");
    this.editorElement?.setAttribute("tabindex", "0");
    this.editorElement?.setAttribute("role", "textbox");
  }

  extensions() {
    return [
      StarterKit.configure({
        ...this.starterKit,
      }),
      RhinoStarterKit.configure({
        ...this.rhinoStarterKit,
      }),
    ];
  }

  /**
   * Extend this to provide your own options, or override existing options.
   *   @example
   *    class ExtendedRhinoEditor extends TipTapEditor {
   *      editorOptions {
   *        return {
   *          autofocus: true
   *        }
   *      }
   *    }
   *
   */
  editorOptions(_element: Element): Partial<EditorOptions> {
    return {};
  }

  updateInputElementValue() {
    if (this.inputElement != null && this.editor != null && !this.readonly) {
      this.inputElement.value = this.serialize();
    }
  }

  serialize() {
    if (this.editor == null) return "";

    if (this.serializer?.toLowerCase() === "json")
      return JSON.stringify(this.editor.getJSON());

    return this.editor.getHTML();
  }

  get inputElement(): Maybe<HTMLInputElement> {
    if (this.input == null) return undefined;

    return document.getElementById(this.input) as Maybe<HTMLInputElement>;
  }

  toggleLinkDialog(): void {
    if (this.linkDialogExpanded) {
      this.closeLinkDialog();
      return;
    }

    this.showLinkDialog();
  }

  closeLinkDialog(): void {
    if (this.linkDialog == null) return;

    this.linkDialogExpanded = false;
    this.linkDialog.setAttribute("hidden", "");
  }

  showLinkDialog(): void {
    if (this.linkDialog == null) return;

    const inputElement = this.linkInputRef.value;

    if (inputElement != null) {
      inputElement.classList.remove("link-validate");
      inputElement.value = "";
    }

    this.linkDialogExpanded = true;
    this.linkDialog.removeAttribute("hidden");
    setTimeout(() => {
      if (inputElement != null) inputElement.focus();
    });
  }

  get linkDialog(): Maybe<HTMLAnchorElement> {
    return this.shadowRoot?.querySelector(
      ".link-dialog"
    ) as Maybe<HTMLAnchorElement>;
  }

  async handleFileUpload(): Promise<void> {
    const input = this.fileInputEl;

    return await new Promise((resolve, _reject) => {
      if (input == null) {
        resolve();
        return;
      }

      if (this.editor == null) return;

      const attachments = this.transformFilesToAttachments(input.files);

      if (attachments == null) return;

      this.editor?.chain().focus().setAttachment(attachments).run()

      attachments.forEach((attachment) => {
        this.dispatchEvent(new AddAttachmentEvent(attachment));
      });

      // Need to reset the input otherwise you get this fun state where you can't
      //   insert the same file multiple times.
      input.value = "";
      resolve();
    });
  }

  handleDropFile = (event: DragEvent) => {
    if (this.editor == null) return;
    if (event == null) return;
    if (!(event instanceof DragEvent)) return;

    const { dataTransfer } = event;
    if (dataTransfer == null) return;

    const hasFiles = dataTransfer.files.length > 0;

    if (!hasFiles) return;

    const { view } = this.editor;

    if (view == null) return;

    const attachments = this.transformFilesToAttachments.call(
      this,
      dataTransfer.files
    );

    if (attachments == null) return;

    event.preventDefault();

    this.editor?.chain().focus().setAttachment(attachments).run()

    attachments.forEach((attachment) => {
      this.dispatchEvent(new AddAttachmentEvent(attachment));
    });
  };

  transformFilesToAttachments(files?: FileList | null) {
    if (this.editor == null) return;
    if (files == null || files.length === 0) return;

    const attachments: AttachmentManager[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file == null) return;
      const src = URL.createObjectURL(file);

      const attachment: AttachmentManager = new AttachmentManager(
        {
          src,
          file,
        },
        this.editor.view
      );

      attachments.push(attachment);
    }

    return attachments;
  }

  get fileInputEl(): Maybe<HTMLInputElement> {
    return this.shadowRoot?.getElementById(
      "file-input"
    ) as Maybe<HTMLInputElement>;
  }

  attachFiles(): void {
    const input = this.fileInputEl;

    if (input == null) return;

    input.click();
  }

  addLink(): void {
    const inputElement = this.linkInputRef.value;

    if (inputElement == null) return;

    const href = inputElement.value;

    try {
      new URL(href);
      inputElement.setCustomValidity("");
    } catch (error) {
      inputElement.setCustomValidity("Not a valid URL");
      inputElement.classList.add("link-validate");
      return;
    }

    if (href) {
      this.closeLinkDialog();
      inputElement.value = "";
      const chain = this.editor
        ?.chain()
        .extendMarkRange("link")
        .setLink({ href });

      if (chain && this.editor?.state.selection.empty) {
        chain.insertContent(href);
      }

      if (chain) {
        chain.run();
      }
    }
  }

  renderBoldButton() {
    return html`
      <button
        class="toolbar__button"
        type="button"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--bold": true,
          "toolbar__button--active": Boolean(this.editor?.isActive("bold")),
          "toolbar__button--disabled":
            this.editor == null || !this.editor.can().toggleBold(),
        })}
        aria-describedby="bold"
        aria-disabled=${this.editor == null || !this.editor.can().toggleBold()}
        aria-pressed=${this.editor?.isActive("bold")}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (
            (e.currentTarget as HTMLElement).getAttribute("aria-disabled") ===
            "true"
          ) {
            return;
          }
          this.editor?.chain().focus().toggleBold().run();
        }}
      >
        <slot name="bold-tooltip">
          <role-tooltip
            id="bold"
            hoist
            part="toolbar-tooltip toolbar-tooltip__bold"
            >${this.translations.bold}</role-tooltip
          >
        </slot>
        <slot name="bold-icon">${this.icons.bold}</slot>
      </button>
    `;
  }

  renderItalicButton() {
    return html`
      <button
        class="toolbar__button"
        tabindex="-1"
        type="button"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--italic": true,
          "toolbar__button--active": Boolean(this.editor?.isActive("italic")),
          "toolbar__button--disabled":
            this.editor == null || !this.editor.can().toggleItalic(),
        })}
        aria-describedby="italics"
        aria-disabled=${this.editor == null ||
        !this.editor.can().toggleItalic()}
        aria-pressed=${this.editor?.isActive("italic")}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (
            (e.currentTarget as HTMLElement).getAttribute("aria-disabled") ===
            "true"
          ) {
            return;
          }
          this.editor?.chain().focus().toggleItalic().run();
        }}
      >
        <slot name="italics-tooltip">
          <role-tooltip
            id="italics"
            hoist
            part="toolbar-tooltip toolbar-tooltip__italics"
            >${this.translations.italics}</role-tooltip
          >
        </slot>
        <slot name="italics-icon">${this.icons.italics}</slot>
      </button>
    `;
  }

  renderStrikeButton() {
    return html`
      <button
        class="toolbar__button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--strike": true,
          "toolbar__button--active": Boolean(this.editor?.isActive("strike")),
          "toolbar__button--disabled": (
            this.editor == null || !this.editor.can().toggleStrike()
          ),
        })}
        aria-describedby="strike"
        aria-disabled=${this.editor == null || !this.editor.can().toggleStrike()}
        aria-pressed=${Boolean(this.editor?.isActive("strike"))}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (
            (e.currentTarget as HTMLElement).getAttribute("aria-disabled") ===
            "true"
          ) {
            return;
          }
          this.editor?.chain().focus().toggleStrike().run()
        }}
      >
        <slot name="strike-tooltip">
          <role-tooltip
            id="strike"
            hoist
            part="toolbar-tooltip toolbar-tooltip__strike"
            >${this.translations.strike}</role-tooltip
          >
        </slot>
        <slot name="strike-icon">${this.icons.strike}</slot>
      </button>
    `;
  }

  renderLinkButton() {
    return html`
      <button
        class="toolbar__button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--link": true,
          "toolbar__button--active": Boolean(this.linkDialogExpanded),
          "toolbar__button--disabled": this.editor == null || !this.editor.can().setLink({ href: "" })
        })}
        aria-describedby="link"
        aria-disabled=${
          this.editor == null || !this.editor.can().setLink({ href: "" })
        }
        aria-pressed=${Boolean(this.linkDialogExpanded)}
        aria-controls="link-dialog"
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (this.editor == null) return;
          if (
            (e.currentTarget as HTMLElement).getAttribute("aria-disabled") ===
            "true"
          )
            return;

          this.toggleLinkDialog();
        }}
      >
        <slot name="link-tooltip">
          <role-tooltip
            id="link"
            hoist
            part="toolbar-tooltip toolbar-tooltip__link"
            >${this.translations.link}</role-tooltip
          >
        </slot>
        <slot name="link-icon">${this.icons.link}</slot>
      </button>
    `;
  }

  renderHeadingButton() {
    return html`
      <button
        class="toolbar__button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--heading": true,
          "toolbar__button--active": Boolean(this.editor?.isActive("heading")),
          "toolbar__button--disabled":
            this.editor == null ||
            !this.editor.can().toggleHeading({ level: 1 }),
        })}
        aria-describedby="heading"
        aria-disabled=${this.editor == null ||
        !this.editor.can().toggleHeading({ level: 1 })}
        aria-pressed=${this.editor?.isActive("heading")}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (
            (e.currentTarget as HTMLElement).getAttribute("aria-disabled") ===
            "true"
          ) {
            return;
          }

          this.editor?.chain().focus().toggleHeading({ level: 1 }).run();
        }}
      >
        <slot name="heading-tooltip">
          <role-tooltip
            id="heading"
            hoist
            part="toolbar-tooltip toolbar-tooltip__heading"
            >${this.translations.heading}</role-tooltip
          >
        </slot>
        <slot name="heading-icon">${this.icons.heading}</slot>
      </button>
    `;
  }

  renderBlockquoteButton() {
    return html`
      <button
        class="toolbar__button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--blockquote": true,
          "toolbar__button--active": Boolean(
            this.editor?.isActive("blockquote")
          ),
          "toolbar__button--disabled":
            this.editor == null || !this.editor.can().toggleBlockquote(),
        })}
        aria-describedby="blockquote"
        aria-disabled=${this.editor == null ||
        !this.editor.can().toggleBlockquote()}
        aria-pressed=${this.editor?.isActive("blockquote")}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (
            (e.currentTarget as HTMLElement).getAttribute("aria-disabled") ===
            "true"
          ) {
            return;
          }

          this.editor?.chain().focus().toggleBlockquote().run();
        }}
      >
        <slot name="blockquote-tooltip">
          <role-tooltip
            id="blockquote"
            hoist
            part="toolbar-tooltip toolbar-tooltip__blockquote"
            >${this.translations.blockQuote}</role-tooltip
          >
        </slot>
        <slot name="blockquote-icon">${this.icons.blockQuote}</slot>
      </button>
    `;
  }

  renderCodeBlockButton() {
    return html`
      <button
        class="toolbar__button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--code-block": true,
          "toolbar__button--active": Boolean(
            this.editor?.isActive("codeBlock")
          ),
          "toolbar__button--disabled":
            this.editor == null || !this.editor.can().toggleCodeBlock(),
        })}
        aria-describedby="code-block"
        aria-disabled=${this.editor == null ||
        !this.editor.can().toggleCodeBlock()}
        aria-pressed=${this.editor?.isActive("codeBlock")}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (
            (e.currentTarget as HTMLElement).getAttribute("aria-disabled") ===
            "true"
          ) {
            return;
          }
          this.editor?.chain().focus().toggleCodeBlock().run();
        }}
      >
        <slot name="code-block-tooltip">
          <role-tooltip
            id="code-block"
            hoist
            part="toolbar-tooltip toolbar-tooltip__code-block"
            >${this.translations.codeBlock}</role-tooltip
          >
        </slot>
        <slot name="code-block-icon">${this.icons.codeBlock}</slot>
      </button>
    `;
  }

  renderBulletListButton() {
    return html`
      <button
        class="toolbar__button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--bullet-list": true,
          "toolbar__button--active": Boolean(
            this.editor?.isActive("bulletList")
          ),
          "toolbar__button--disabled":
            this.editor == null || !this.editor.can().toggleBulletList(),
        })}
        aria-describedby="bullet-list"
        aria-disabled=${this.editor == null ||
        !this.editor.can().toggleBulletList()}
        aria-pressed=${this.editor?.isActive("bulletList")}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (
            (e.currentTarget as HTMLElement).getAttribute("aria-disabled") ===
            "true"
          ) {
            return;
          }
          this.editor?.chain().focus().toggleBulletList().run();
        }}
      >
        <slot name="bullet-list-tooltip">
          <role-tooltip
            id="bullet-list"
            hoist
            part="toolbar-tooltip toolbar-tooltip__bullet-list"
            >${this.translations.bulletList}</role-tooltip
          >
        </slot>
        <slot name="bullet-list-icon">${this.icons.bulletList}</slot>
      </button>
    `;
  }

  renderOrderedListButton() {
    return html`
      <button
        class="toolbar__button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--ordered-list": true,
          "toolbar__button--active": Boolean(
            this.editor?.isActive("orderedList")
          ),
          "toolbar__button--disabled":
            this.editor == null || !this.editor.can().toggleOrderedList(),
        })}
        aria-describedby="ordered-list"
        aria-disabled=${this.editor == null ||
        !this.editor.can().toggleOrderedList()}
        aria-pressed=${this.editor?.isActive("orderedList")}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (
            (e.currentTarget as HTMLElement).getAttribute("aria-disabled") ===
            "true"
          ) {
            return;
          }

          this.editor?.chain().focus().toggleOrderedList().run();
        }}
      >
        <slot name="ordered-list-tooltip">
          <role-tooltip
            id="ordered-list"
            hoist
            part="toolbar-tooltip toolbar-tooltip__ordered-list"
            >${this.translations.orderedList}</role-tooltip
          >
        </slot>
        <slot name="ordered-list-icon">${this.icons.orderedList}</slot>
      </button>
    `;
  }

  renderAttachmentButton() {
    return html`
      <button
        class="toolbar__button toolbar__button--attach-files"
        tabindex="-1"
        type="button"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--attach-files": true,
          "toolbar__button--disabled": this.editor == null,
        })}
        aria-describedby="attach-files"
        aria-disabled=${this.editor == null}
        data-role="toolbar-item"
        @click=${this.attachFiles}
      >
        <slot name="attach-files-tooltip">
          <role-tooltip
            id="attach-files"
            hoist
            part="toolbar-tooltip toolbar-tooltip__attach-files"
            >${this.translations.attachFiles}</role-tooltip
          >
        </slot>
        <slot name="attach-files-icon">${this.icons.attachFiles}</slot>

        <!-- @TODO: Write documentation. Hookup onchange to the slotted elements -->
        <slot name="attach-files-input">
          <input
            id="file-input"
            type="file"
            hidden
            multiple
            accept=${this.accept || "*"}
            @change=${async () => await this.handleFileUpload()}
          />
        </slot>
      </button>
    `;
  }

  renderUndoButton() {
    return html`
      <button
        class="toolbar__button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--undo": true,
          "toolbar__button--disabled":
            this.editor == null || !this.editor.can().undo(),
        })}
        aria-describedby="undo"
        aria-disabled=${this.editor == null || !this.editor.can().undo()}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (
            (e.currentTarget as HTMLElement).getAttribute("aria-disabled") ===
            "true"
          ) {
            return;
          }
          this.editor?.chain().focus().undo().run();
        }}
      >
        <slot name="undo-tooltip">
          <role-tooltip
            id="undo"
            hoist
            part="toolbar-tooltip toolbar-tooltip__undo"
            >${this.translations.undo}</role-tooltip
          >
        </slot>
        <slot name="undo-icon">${this.icons.undo}</slot>
      </button>
    `;
  }

  renderDecreaseIndentation() {
    return html`
      <button
        class="toolbar__button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--decrease-indentation": true,
          "toolbar__button--disabled":
            this.editor == null || !this.editor.can().sinkListItem('listItem')
        })}
        aria-describedby="decrease-indentation"
        aria-disabled=${this.editor == null || !this.editor.can().sinkListItem('listItem')}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (
            (e.currentTarget as HTMLElement).getAttribute("aria-disabled") ===
            "true"
          ) {
            return;
          }
          this.editor?.chain().focus().sinkListItem("listItem").run();
        }}
      >
        <slot name="decrease-indentation-tooltip">
          <role-tooltip
            id="decrease-indentation"
            hoist
            part="toolbar-tooltip toolbar-tooltip__decrease-indentation"
            >${this.translations.decreaseIndentation}</role-tooltip
          >
        </slot>
        <slot name="decrease-indentation">${this.icons.decreaseIndentation}</slot>
      </button>
    `;
  }

  renderIncreaseIndentation() {
    return html`
      <button
        class="toolbar__button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--increase-indentation": true,
          "toolbar__button--disabled":
            this.editor == null || !this.editor.can().sinkListItem('listItem')
        })}
        aria-describedby="increase-indentation"
        aria-disabled=${this.editor == null || !this.editor.can().sinkListItem('listItem')}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (
            (e.currentTarget as HTMLElement).getAttribute("aria-disabled") ===
            "true"
          ) {
            return;
          }
          this.editor?.chain().focus().sinkListItem("listItem").run();
        }}
      >
        <slot name="increase-indentation-tooltip">
          <role-tooltip
            id="increase-indentation"
            hoist
            part="toolbar-tooltip toolbar-tooltip__increase-indentation"
            >${this.translations.increaseIndentation}</role-tooltip
          >
        </slot>
        <slot name="increase-indentation">${this.icons.increaseIndentation}</slot>
      </button>
    `;
  }

  renderRedoButton() {
    return html`
      <button
        class="toolbar__button"
        tabindex="-1"
        type="button"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--redo": true,
          "toolbar__button--disabled":
            this.editor == null || !this.editor.can().redo(),
        })}
        aria-describedby="redo"
        aria-disabled=${this.editor == null || !this.editor.can().redo()}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (
            (e.currentTarget as HTMLElement).getAttribute("aria-disabled") ===
            "true"
          ) {
            return;
          }
          this.editor?.chain().focus().redo().run();
        }}
      >
        <slot name="redo-tooltip">
          <role-tooltip
            id="redo"
            hoist
            part="toolbar-tooltip toolbar-tooltip__redo"
            >${this.translations.redo}</role-tooltip
          >
        </slot>
        <slot name="redo-icon">${this.icons.redo}</slot>
      </button>
    `;
  }

  renderStart() {
    return html``;
  }

  renderEnd() {
    return html``;
  }

  renderToolbar() {
    if (this.readonly) return html``;

    return html`
      <slot name="toolbar">
        <role-toolbar class="toolbar" part="toolbar" role="toolbar">
          <slot name="toolbar-start">${this.renderStart()}</slot>

          <!-- Bold -->
          <slot name="before-bold-button"></slot>
          <slot name="bold-button">${this.renderBoldButton()}</slot>
          <slot name="after-bold-button"></slot>

          <!-- Italic -->
          <slot name="before-italic-button"></slot>
          <slot name="italic-button">${this.renderItalicButton()}</slot>
          <slot name="after-italic-button"></slot>

          <!-- Strike -->
          <slot name="before-strike-button"></slot>
          <slot name="strike-button">${this.renderStrikeButton()}</slot>
          <slot name="after-strike-button"></slot>

          <!-- Link -->
          <slot name="before-link-button"></slot>
          <slot name="link-button">${this.renderLinkButton()}</slot>
          <slot name="after-link-button"></slot>

          <!-- Heading -->
          <slot name="before-heading-button"></slot>
          <slot name="heading-button">${this.renderHeadingButton()}</slot>
          <slot name="after-heading-button"></slot>

          <!-- Blockquote -->
          <slot name="before-blockquote-button"></slot>
          <slot name="blockquote-button"
            >${this.renderBlockquoteButton()}</slot
          >
          <slot name="after-blockquote-button"></slot>

          <!-- Code block -->
          <slot name="before-code-block-button"></slot>
          <slot name="code-block-button">${this.renderCodeBlockButton()}</slot>
          <slot name="after-code-block-button"></slot>

          <!-- Bullet List -->
          <slot name="before-bullet-list-button"></slot>
          <slot name="bullet-list-button"
            >${this.renderBulletListButton()}</slot
          >
          <slot name="after-bullet-list-button"></slot>

          <!-- Ordered list -->
          <slot name="before-ordered-list-button"></slot>
          <slot name="ordered-list-button">
            ${this.renderOrderedListButton()}
          </slot>
          <slot name="after-ordered-list-button"></slot>

          <slot name="before-decrease-indentation-button"></slot>
          <slot name="decrease-indentation-button">${this.renderDecreaseIndentation()}</slot>
          <slot name="after-decrease-indentation-button"></slot>

          <slot name="before-increase-indentation-button"></slot>
          <slot name="increase-indentation-button">${this.renderIncreaseIndentation()}</slot>
          <slot name="after-increase-indentation-button"></slot>

          <!-- Attachments -->
          <slot name="before-attach-files-button"></slot>
          <slot name="attach-files-button"
            >${this.renderAttachmentButton()}</slot
          >
          <slot name="after-attach-files-button"></slot>

          <!-- Undo -->
          <slot name="before-undo-button"></slot>
          <slot name="undo-button">${this.renderUndoButton()}</slot>
          <slot name="after-undo-button"></slot>

          <!-- Redo -->
          <slot name="before-redo-button"></slot>
          <slot name="redo-button">${this.renderRedoButton()}</slot>
          <slot name="after-redo-button"></slot>

          <slot name="toolbar-end">${this.renderEnd()}</slot>
        </role-toolbar>
      </slot>
    `;
  }

  /** @TODO: Lets think of a more friendly way to render dialogs for users to extend. */
  renderLinkCreationDialog(): TemplateResult {
    if (this.readonly) return html``;
    return html` <div
      id="link-dialog"
      class="link-dialog"
      part="link-dialog"
      hidden
      @click=${(event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const currentTarget = event.currentTarget as HTMLElement;

        if (currentTarget.contains(target) && currentTarget !== target) {
          return;
        }

        this.closeLinkDialog();
      }}
    >
      <div class="link-dialog__container" part="link-dialog__container">
        <input
          id="link-dialog__input"
          class="link-dialog__input"
          part="link-dialog__input"
          type="text"
          placeholder="Enter a URL..."
          aria-label="Enter a URL"
          required
          type="url"
          ${ref(this.linkInputRef)}
          @input=${() => {
            const inputElement = this.linkInputRef.value;
            if (inputElement == null) return;

            inputElement.setCustomValidity("");
          }}
          @blur=${() => {
            const inputElement = this.linkInputRef.value;

            if (inputElement == null) return;

            inputElement.classList.remove("link-validate");
            // inputElement.value = ""
          }}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key?.toLowerCase() === "enter") {
              e.preventDefault();
              this.addLink();
            }
          }}
        />
        <div class="link-dialog__buttons" part="link-dialog__buttons">
          <button
            class="link-dialog__button"
            part="link-dialog__button link-dialog__button-add-link"
            @click=${this.addLink}
          >
            ${this.translations.linkDialogLink}
          </button>
          <button
            class="link-dialog__button"
            part="link-dialog__button link-dialog__button-unlink"
            @click=${() => {
              this.editor?.chain().focus().extendMarkRange("link").unsetLink().run();
            }}
          >
            ${this.translations.linkDialogUnlink}
          </button>
        </div>
      </div>
    </div>`;
  }

  render(): TemplateResult {
    return html`
      ${this.renderToolbar()}
      <div
        ${ref(this.editorElementChanged)}
        class="editor-wrapper"
        part="editor-wrapper"
      >
        ${this.renderLinkCreationDialog()}
        <div class="editor" part="editor"><slot name="editor"></slot></div>
      </div>
    `;
  }

  /**
   * Due to some inconsistencies in how Trix will render the inputElement based on if its
   * the HTML representation, or transfromed with `#to_trix_html` this gives
   * us a consistent DOM structure to parse for rich text comments.
   */
  normalizeDOM(
    inputElement: Maybe<HTMLInputElement>,
    parser = new DOMParser()
  ) {
    if (inputElement == null || inputElement.value == null) return;

    const doc = parser.parseFromString(inputElement.value, "text/html");
    const figures = [...doc.querySelectorAll("figure[data-trix-attachment]")];
    const filtersWithoutChildren = figures.filter(
      (figure) => figure.querySelector("figcaption") == null
    );

    doc.querySelectorAll("div > figure:first-child").forEach((el) => {
      el.parentElement?.classList.add("attachment-gallery");
    });

    filtersWithoutChildren.forEach((figure) => {
      const attrs = figure.getAttribute("data-trix-attributes");

      if (!attrs) return;

      const { caption } = JSON.parse(attrs);
      if (caption) {
        figure.insertAdjacentHTML(
          "beforeend",
          `<figcaption class="attachment__caption">${caption}</figcaption>`
        );
        return;
      }
    });

    doc.querySelectorAll("figure .attachment__name").forEach((el) => {
      if (el.textContent?.includes(" · ") === false) return;

      el.insertAdjacentText("beforeend", " · ");
    });

    const body = doc.querySelector("body");

    if (body) {
      inputElement.value = body.innerHTML;
    }
  }

  #defaultOptions(element: Element): Partial<EditorOptions> {
    let content: Content = this.inputElement?.value || "";

    if (content && this.serializer?.toLowerCase() === "json") {
      content = JSON.parse(content);
    }

    return {
      injectCSS: false,
      extensions: this.extensions(),
      autofocus: false,
      element,
      content,
      editable: !this.readonly,
    };
  }

  #handleCreate = () => {
    this.requestUpdate();
  };

  #handleUpdate = () => {
    this.updateInputElementValue();
    this.requestUpdate();
  };

  #handleFocus = () => {
    this.closeLinkDialog();
    this.requestUpdate();
  };

  #handleBlur = () => {
    this.updateInputElementValue();
    this.requestUpdate();
  };

  #handleSelectionUpdate = () => {
    this.requestUpdate();
  };

  #handleTransaction = () => {
    this.requestUpdate();
  };

  #bindEditorListeners(): void {
    if (this.editor == null) return;

    this.editor.on("focus", this.#handleFocus);
    this.editor.on("create", this.#handleCreate);
    this.editor.on("update", this.#handleUpdate);
    this.editor.on("selectionUpdate", this.#handleSelectionUpdate);
    this.editor.on("transaction", this.#handleTransaction);
    this.editor.on("blur", this.#handleBlur);
  }

  #unBindEditorListeners(): void {
    if (this.editor == null) return;

    this.editor.off("focus", this.#handleFocus);
    this.editor.off("create", this.#handleCreate);
    this.editor.off("update", this.#handleUpdate);
    this.editor.off("selectionUpdate", this.#handleSelectionUpdate);
    this.editor.off("transaction", this.#handleTransaction);
    this.editor.off("blur", this.#handleBlur);
  }

  #setupEditor(element: Element): Editor {
    if (!this.serializer || this.serializer === "html") {
      // This is a super hacky way to get #to_trix_html to support figcaptions without patching it.
      this.normalizeDOM(this.inputElement);
    }

    return new Editor({
      ...this.#defaultOptions(element),
      ...this.editorOptions,
    });
  }
}
