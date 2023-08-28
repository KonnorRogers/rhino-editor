import { ref, createRef, Ref } from "lit/directives/ref.js";
import { toolbarButtonStyles } from "../styles/editor.js";
import { TipTapEditorBase } from "./tip-tap-editor-base.js";
import { PropertyDeclarations, TemplateResult } from "lit";

/** Imports <role-tooltip> and <role-toolbar> */
import { RoleToolbar } from "role-components/dist/toolbar/component.js";
import { RoleTooltip } from "role-components/dist/tooltip/component.js";

import { isiOS, translations } from "../translations.js";

/** This will probably go away in favor of lazy loaded SVGs. */
import * as icons from "../../internal/icons";
import { Maybe } from "../../types.js";
import { html } from "lit/html.js";
import { stringMap } from "../../internal/string-map.js";
import { isExactNodeActive } from "../../internal/is-exact-node-active.js";

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

 * ## Decrease Indentation
 * @slot before-decrease-indentation-button
 * @slot decrease-indentation-button
 * @slot after-decrease-indentation-button

 * ## Increase Indentation
 * @slot before-increase-indentation-button
 * @slot increase-indentation-button
 * @slot after-increase-indentation-button

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
export class TipTapEditor extends TipTapEditorBase {
  static get styles() {
    return TipTapEditorBase.styles.concat([toolbarButtonStyles]);
  }

  static get properties(): PropertyDeclarations {
    return Object.assign(TipTapEditorBase.properties, {
      linkDialogExpanded: { type: Boolean },
      linkInputRef: { state: true },
      translations: { state: true },
      __invalidLink__: { state: true, type: Boolean },
    });
  }

  /**
   * Translations for various aspects of the editor.
   */
  translations = translations;

  /**
   * The <input> for inserting links
   */
  linkInputRef: Ref<HTMLInputElement> = createRef();

  /**
   * The dialog that contains the link input + link / unlink buttons
   */
  linkDialogExpanded: boolean = false;

  private __invalidLink__: boolean = false;

  /**
   * @override
   */
  registerDependencies() {
    super.registerDependencies();
    [RoleToolbar, RoleTooltip].forEach((el) => el.define());
  }

  constructor() {
    super();

    this.starterKitOptions = Object.assign(super.starterKitOptions, {
      rhinoPlaceholder: {
        placeholder: this.translations.placeholder,
      },
      rhinoAttachment: {
        fileUploadErrorMessage: this.translations.fileUploadErrorMessage,
      },
    }) as typeof this.starterKitOptions;

    this.addEventListener("keydown", this.handleKeyboardDialogToggle);
  }

  /**
   * @override
   */
  async connectedCallback() {
    super.connectedCallback();

    await this.updateComplete;

    if (this.editor) {
      this.editor.on("focus", this.closeLinkDialog);
    }
  }

  get icons(): typeof icons {
    return icons;
  }

  /** Closes the dialog for link previews */
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
      inputElement.value = "";
    }

    this.__invalidLink__ = false;
    this.linkDialogExpanded = true;
    this.linkDialog.removeAttribute("hidden");
    setTimeout(() => {
      if (inputElement != null) inputElement.focus();
    });
  }

  get linkDialog(): Maybe<HTMLAnchorElement> {
    return this.shadowRoot?.querySelector(
      ".link-dialog",
    ) as Maybe<HTMLAnchorElement>;
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
      this.__invalidLink__ = false;
    } catch (error) {
      inputElement.setCustomValidity("Not a valid URL");
      this.__invalidLink__ = true;
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

  get fileInputEl(): Maybe<HTMLInputElement> {
    return this.shadowRoot?.getElementById(
      "file-input",
    ) as Maybe<HTMLInputElement>;
  }

  async handleFileUpload(): Promise<void> {
    const input = this.fileInputEl;
    if (input == null) return;
    if (input.files == null) return;

    await this.handleFiles(input.files);

    input.value = "";
  }

  private get __tooltipExportParts() {
    return "base:tooltip-base, arrow:tooltip-arrow";
  }

  renderBoldButton() {
    const boldEnabled = Boolean(this.editor?.commands.toggleBold);

    if (!boldEnabled) return html``;

    const isDisabled = this.editor == null || !this.editor.can().toggleBold();
    const isActive = Boolean(this.editor?.isActive("bold"));

    return html`
      <button
        class="toolbar__button rhino-toolbar-button"
        type="button"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--bold": true,
          "toolbar__button--active": isActive,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-describedby="bold"
        aria-disabled=${isDisabled}
        aria-pressed=${isActive}
        data-role="toolbar-item"
        @click=${async (e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) return;
          this.editor?.chain().focus().toggleBold().run();
        }}
      >
        <slot name="bold-tooltip">
          <role-tooltip
            id="bold"
            hoist
            part="toolbar-tooltip toolbar-tooltip__bold"
            exportparts=${this.__tooltipExportParts}
          >
            ${this.translations.bold}
          </role-tooltip>
        </slot>
        <slot name="bold-icon">${this.icons.bold}</slot>
      </button>
    `;
  }

  renderItalicButton() {
    const italicEnabled = Boolean(this.editor?.commands.toggleItalic);

    if (!italicEnabled) return html``;

    const isActive = Boolean(this.editor?.isActive("italic"));
    const isDisabled = this.editor == null || !this.editor.can().toggleItalic();

    return html`
      <button
        class="toolbar__button rhino-toolbar-button"
        tabindex="-1"
        type="button"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--italic": true,
          "toolbar__button--active": isActive,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-describedby="italics"
        aria-disabled=${isDisabled}
        aria-pressed=${isActive}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
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
            exportparts=${this.__tooltipExportParts}
          >
            ${this.translations.italics}
          </role-tooltip>
        </slot>
        <slot name="italics-icon"> ${this.icons.italics} </slot>
      </button>
    `;
  }

  renderStrikeButton() {
    const strikeEnabled = Boolean(this.editor?.commands.toggleStrike);

    if (!strikeEnabled) return html``;

    const isActive = Boolean(this.editor?.isActive("rhino-strike"));
    const isDisabled = this.editor == null || !this.editor.can().toggleStrike();

    return html`
      <button
        class="toolbar__button rhino-toolbar-button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--strike": true,
          "toolbar__button--active": isActive,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-describedby="strike"
        aria-disabled=${isDisabled}
        aria-pressed=${isActive}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
            return;
          }
          this.editor?.chain().focus().toggleStrike().run();
        }}
      >
        <slot name="strike-tooltip">
          <role-tooltip
            id="strike"
            hoist
            part="toolbar-tooltip toolbar-tooltip__strike"
            exportparts=${this.__tooltipExportParts}
          >
            ${this.translations.strike}
          </role-tooltip>
        </slot>
        <slot name="strike-icon">${this.icons.strike}</slot>
      </button>
    `;
  }

  renderLinkButton() {
    const linkEnabled = Boolean(this.editor?.commands.setLink);

    if (!linkEnabled) return html``;

    const isActive = Boolean(this.linkDialogExpanded);
    const isDisabled =
      this.editor == null || !this.editor.can().setLink({ href: "" });

    return html`
      <button
        class="toolbar__button rhino-toolbar-button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--link": true,
          "toolbar__button--active": isActive,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-describedby="link"
        aria-disabled=${isDisabled}
        aria-pressed=${isActive}
        aria-controls="link-dialog"
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (this.editor == null) return;
          if (elementDisabled(e.currentTarget)) return;

          this.toggleLinkDialog();
        }}
      >
        <slot name="link-tooltip">
          <role-tooltip
            id="link"
            hoist
            part="toolbar-tooltip toolbar-tooltip__link"
            exportparts=${this.__tooltipExportParts}
          >
            ${this.translations.link}
          </role-tooltip>
        </slot>
        <slot name="link-icon">${this.icons.link}</slot>
      </button>
    `;
  }

  renderHeadingButton() {
    const headingEnabled = Boolean(this.editor?.commands.toggleHeading);

    if (!headingEnabled) return html``;

    const isActive = Boolean(this.editor?.isActive("heading"));
    const isDisabled =
      this.editor == null || !this.editor.can().toggleHeading({ level: 1 });

    return html`
      <button
        class="toolbar__button rhino-toolbar-button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--heading": true,
          "toolbar__button--active": isActive,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-describedby="heading"
        aria-disabled=${isDisabled}
        aria-pressed=${isActive}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
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
            exportparts=${this.__tooltipExportParts}
          >
            ${this.translations.heading}
          </role-tooltip>
        </slot>
        <slot name="heading-icon">${this.icons.heading}</slot>
      </button>
    `;
  }

  renderBlockquoteButton() {
    const blockQuoteEnabled = Boolean(this.editor?.commands.toggleBlockquote);

    if (!blockQuoteEnabled) return html``;

    const isActive = Boolean(this.editor?.isActive("blockquote"));
    const isDisabled =
      this.editor == null || !this.editor.can().toggleBlockquote();

    return html`
      <button
        class="toolbar__button rhino-toolbar-button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--blockquote": true,
          "toolbar__button--active": isActive,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-describedby="blockquote"
        aria-disabled=${isDisabled}
        aria-pressed=${isActive}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
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
            exportparts=${this.__tooltipExportParts}
          >
            ${this.translations.blockQuote}
          </role-tooltip>
        </slot>
        <slot name="blockquote-icon">${this.icons.blockQuote}</slot>
      </button>
    `;
  }

  renderCodeBlockButton() {
    const codeBlockEnabled = Boolean(this.editor?.commands.toggleCodeBlock);

    if (!codeBlockEnabled) return html``;

    const isActive = Boolean(this.editor?.isActive("codeBlock"));
    const isDisabled =
      this.editor == null || !this.editor.can().toggleCodeBlock();

    return html`
      <button
        class="toolbar__button rhino-toolbar-button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--code-block": true,
          "toolbar__button--active": isActive,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-describedby="code-block"
        aria-disabled=${isDisabled}
        aria-pressed=${isActive}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
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
            exportparts=${this.__tooltipExportParts}
          >
            ${this.translations.codeBlock}
          </role-tooltip>
        </slot>
        <slot name="code-block-icon">${this.icons.codeBlock}</slot>
      </button>
    `;
  }

  renderBulletListButton() {
    const bulletListEnabled = Boolean(this.editor?.commands.toggleBulletList);

    if (!bulletListEnabled) return html``;

    const isDisabled =
      this.editor == null ||
      !(
        this.editor.can().toggleOrderedList?.() ||
        this.editor.can().toggleBulletList()
      );

    const isActive = Boolean(
      this.editor != null && isExactNodeActive(this.editor.state, "bulletList"),
    );

    return html`
      <button
        class="toolbar__button rhino-toolbar-button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--bullet-list": true,
          "toolbar__button--active": isActive,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-describedby="bullet-list"
        aria-disabled=${isDisabled}
        aria-pressed=${isActive}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
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
            exportparts=${this.__tooltipExportParts}
          >
            ${this.translations.bulletList}
          </role-tooltip>
        </slot>
        <slot name="bullet-list-icon">${this.icons.bulletList}</slot>
      </button>
    `;
  }

  renderOrderedListButton() {
    const orderedListEnabled = Boolean(this.editor?.commands.toggleOrderedList);

    if (!orderedListEnabled) return html``;

    const isDisabled =
      this.editor == null ||
      !(
        this.editor.can().toggleOrderedList() ||
        this.editor.can().toggleBulletList?.()
      );

    const isActive = Boolean(
      this.editor != null &&
        isExactNodeActive(this.editor.state, "orderedList"),
    );

    return html`
      <button
        class="toolbar__button rhino-toolbar-button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--ordered-list": true,
          "toolbar__button--active": isActive,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-describedby="ordered-list"
        aria-disabled=${isDisabled}
        aria-pressed=${isActive}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
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
            exportparts=${this.__tooltipExportParts}
          >
            ${this.translations.orderedList}
          </role-tooltip>
        </slot>
        <slot name="ordered-list-icon">${this.icons.orderedList}</slot>
      </button>
    `;
  }

  renderAttachmentButton() {
    const attachmentEnabled = Boolean(this.editor?.commands.setAttachment);

    if (!attachmentEnabled) return html``;

    const isDisabled = this.editor == null;

    return html`
      <button
        class="toolbar__button rhino-toolbar-button"
        tabindex="-1"
        type="button"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--attach-files": true,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-describedby="attach-files"
        aria-disabled=${isDisabled}
        data-role="toolbar-item"
        @click=${this.attachFiles}
      >
        <slot name="attach-files-tooltip">
          <role-tooltip
            id="attach-files"
            hoist
            part="toolbar-tooltip toolbar-tooltip__attach-files"
            exportparts=${this.__tooltipExportParts}
          >
            ${this.translations.attachFiles}
          </role-tooltip>
        </slot>
        <slot name="attach-files-icon">${this.icons.attachFiles}</slot>

        <!-- @TODO: Write documentation. Hookup onchange to the slotted elements? -->
        <slot name="attach-files-input">
          <input
            id="file-input"
            type="file"
            hidden
            multiple
            accept=${this.accept || "*"}
            @change=${this.handleFileUpload}
          />
        </slot>
      </button>
    `;
  }

  renderUndoButton() {
    const undoEnabled = Boolean(this.editor?.commands.undo);

    if (!undoEnabled) return html``;

    const isDisabled = this.editor == null || !this.editor.can().undo();

    return html`
      <button
        class="toolbar__button rhino-toolbar-button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--undo": true,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-describedby="undo"
        aria-disabled=${isDisabled}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
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
            exportparts=${this.__tooltipExportParts}
          >
            ${this.translations.undo}
          </role-tooltip>
        </slot>
        <slot name="undo-icon">${this.icons.undo}</slot>
      </button>
    `;
  }

  renderDecreaseIndentation() {
    // Decrease / increase indentation are special cases in that they rely on built-in editor
    // commands and not commands added by extensions.
    const decreaseIndentationNotEnabled =
      this.starterKitOptions.decreaseIndentation == false;

    if (decreaseIndentationNotEnabled) return html``;

    const isDisabled =
      this.editor == null || !this.editor.can().liftListItem("listItem");

    return html`
      <button
        class="toolbar__button rhino-toolbar-button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--decrease-indentation": true,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-describedby="decrease-indentation"
        aria-disabled=${isDisabled}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
            return;
          }
          this.editor?.chain().focus().liftListItem("listItem").run();
        }}
      >
        <slot name="decrease-indentation-tooltip">
          <role-tooltip
            id="decrease-indentation"
            hoist
            part="toolbar-tooltip toolbar-tooltip__decrease-indentation"
          >
            ${this.translations.decreaseIndentation}
          </role-tooltip>
        </slot>
        <slot name="decrease-indentation"
          >${this.icons.decreaseIndentation}</slot
        >
      </button>
    `;
  }

  renderIncreaseIndentation() {
    const increaseIndentationNotEnabled =
      this.starterKitOptions.increaseIndentation == false;

    if (increaseIndentationNotEnabled) return html``;

    const isDisabled =
      this.editor == null || !this.editor.can().sinkListItem("listItem");

    return html`
      <button
        class="toolbar__button rhino-toolbar-button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--increase-indentation": true,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-describedby="increase-indentation"
        aria-disabled=${isDisabled}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
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
            exportparts=${this.__tooltipExportParts}
          >
            ${this.translations.increaseIndentation}
          </role-tooltip>
        </slot>
        <slot name="increase-indentation"
          >${this.icons.increaseIndentation}</slot
        >
      </button>
    `;
  }

  renderRedoButton() {
    const redoEnabled = Boolean(this.editor?.commands.redo);

    if (!redoEnabled) return html``;

    const isDisabled = this.editor == null || !this.editor.can().redo?.();

    return html`
      <button
        class="toolbar__button rhino-toolbar-button"
        tabindex="-1"
        type="button"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--redo": true,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-describedby="redo"
        aria-disabled=${isDisabled}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
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
            exportparts=${this.__tooltipExportParts}
          >
            ${this.translations.redo}
          </role-tooltip>
        </slot>
        <slot name="redo-icon">${this.icons.redo}</slot>
      </button>
    `;
  }

  renderToolbarStart() {
    return html``;
  }

  renderToolbarEnd() {
    return html``;
  }

  renderToolbar() {
    if (this.readonly) return html``;

    return html`
      <slot name="toolbar">
        <role-toolbar class="toolbar" part="toolbar" role="toolbar">
          <slot name="toolbar-start">${this.renderToolbarStart()}</slot>

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
          <slot name="blockquote-button">${this.renderBlockquoteButton()}</slot>
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
          <slot name="decrease-indentation-button"
            >${this.renderDecreaseIndentation()}</slot
          >
          <slot name="after-decrease-indentation-button"></slot>

          <slot name="before-increase-indentation-button"></slot>
          <slot name="increase-indentation-button"
            >${this.renderIncreaseIndentation()}</slot
          >
          <slot name="after-increase-indentation-button"></slot>

          <!-- Attachments -->
          <slot name="before-attach-files-button"></slot>
          <slot name="attach-files-button"
            >${this.renderAttachmentButton()}</slot
          >
          <slot name="after-attach-files-button"></slot>

          <!-- Undo -->
          <slot name="before-undo-button"></slot>
          <!-- @ts-expect-error -->
          <slot name="undo-button"> ${this.renderUndoButton()} </slot>
          <slot name="after-undo-button"></slot>

          <!-- Redo -->
          <slot name="before-redo-button"></slot>
          <slot name="redo-button"> ${this.renderRedoButton()} </slot>
          <slot name="after-redo-button"></slot>

          <slot name="toolbar-end">${this.renderToolbarEnd()}</slot>
        </role-toolbar>
      </slot>
    `;
  }

  /** @TODO: Lets think of a more friendly way to render dialogs for users to extend. */
  renderDialog(): TemplateResult {
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
          class=${`link-dialog__input ${
            this.__invalidLink__ ? "link-validate" : ""
          }`}
          part=${`link-dialog__input ${
            this.__invalidLink__ ? "link-dialog__input--invalid" : ""
          }`}
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
            this.__invalidLink__ = false;
          }}
          @blur=${() => {
            const inputElement = this.linkInputRef.value;

            if (inputElement == null) return;

            this.__invalidLink__ = false;
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
              this.editor
                ?.chain()
                .focus()
                .extendMarkRange("link")
                .unsetLink()
                .run();
            }}
          >
            ${this.translations.linkDialogUnlink}
          </button>
        </div>
      </div>
    </div>`;
  }
}

function elementDisabled(element: null | EventTarget | Element): boolean {
  if (element == null) return true;
  if (!("getAttribute" in element)) return true;

  return (
    element.getAttribute("aria-disabled") === "true" ||
    element.hasAttribute("disabled")
  );
}
