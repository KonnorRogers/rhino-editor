import { ref, createRef, Ref } from "lit/directives/ref.js";
import { toolbarButtonStyles } from "../styles/editor.js";
import { TipTapEditorBase } from "./tip-tap-editor-base.js";
import { PropertyDeclarations, PropertyValues } from "lit";

/** Imports <role-tooltip> and <role-toolbar> */
import RoleToolbar from "role-components/exports/components/toolbar/toolbar.js";
import RoleTooltip from "role-components/exports/components/tooltip/tooltip.js";

import { isiOS, translations } from "../translations.js";

/** This will probably go away in favor of lazy loaded SVGs. */
import * as icons from "../../internal/icons";
import { Maybe } from "../../types.js";
import { html } from "lit/html.js";
import { stringMap } from "../../internal/string-map.js";
import { isExactNodeActive } from "../../internal/is-exact-node-active.js";
import RoleAnchoredRegion from "role-components/exports/components/anchored-region/anchored-region.js";
import { findNodeViewAnchor } from "../extensions/bubble-menu.js";
import { Editor, isNodeSelection, posToDOMRect } from "@tiptap/core";

function findElement(editor: Editor) {
  if (!editor) {
    return null;
  }

  const state = editor.state;
  const { selection } = state;
  const view = editor.view;

  if (view.composing) {
    return null;
  }

  // support for CellSelections
  const { ranges } = selection;
  const from = Math.min(...ranges.map((range) => range.$from.pos));
  const to = Math.max(...ranges.map((range) => range.$to.pos));

  let clientRect: null | (() => DOMRect) = null;

  if (isNodeSelection(state.selection)) {
    const node =
      findNodeViewAnchor?.({
        editor,
        view,
        from,
      }) || (view.nodeDOM(from) as HTMLElement);

    if (node) {
      node.scrollIntoView({ block: "nearest" });
      clientRect = () => {
        const rect = node.getBoundingClientRect();
        return rect;
      };
    }
  } else {
    const toNode = view.domAtPos(to).node;
    if (toNode instanceof HTMLElement) {
      // Scroll it into view so we can see the bubble menu
      toNode.scrollIntoView({ block: "nearest" });
    }

    clientRect = () => {
      const rect = posToDOMRect(view, from, to);
      rect.x = rect.x - rect.width / 2;
      return rect;
    };
  }

  return clientRect;
}

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
 *
 * ## Events
 * @rhino-bubble-menu-show
 * @rhino-bubble-menu-hide
 */
export class TipTapEditor extends TipTapEditorBase {
  static get styles() {
    return TipTapEditorBase.styles.concat([toolbarButtonStyles]);
  }

  static get properties(): PropertyDeclarations {
    return Object.assign(TipTapEditorBase.properties, {
      linkDialogExpanded: {
        type: Boolean,
        reflect: true,
        attribute: "link-dialog-expanded",
      },
      altTextEditor: {
        type: Boolean,
        reflect: true,
        attribute: "alt-text-editor",
      },
      defaultHeadingLevel: { attribute: "default-heading-level", type: Number },
      linkInputRef: { state: true },
      translations: { state: true },
      __invalidLink__: { state: true, type: Boolean },
    });
  }

  /**
   * Whether or not to enable the alt text editor.
   */
  altTextEditor = false;

  /**
   * The heading level to use for the heading button
   */
  defaultHeadingLevel: 1 | 2 | 3 | 4 | 5 | 6 = 1;

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
    [RoleToolbar, RoleTooltip, RoleAnchoredRegion].forEach((el) => el.define());
  }

  constructor() {
    super();

    this.starterKitOptions = Object.assign(this.starterKitOptions, {
      rhinoPlaceholder: {
        placeholder: this.translations.placeholder,
      },
      rhinoAttachment: {
        fileUploadErrorMessage: this.translations.fileUploadErrorMessage,
        captionPlaceholder: this.translations.captionPlaceholder,
      },
    }) as typeof this.starterKitOptions;

    this.addEventListener("keydown", this.handleKeyboardDialogToggle);
  }

  protected updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has("altTextEditor")) {
      if (this.starterKitOptions.rhinoAttachment !== false) {
        this.starterKitOptions = {
          ...this.starterKitOptions,
          rhinoAttachment: {
            ...this.starterKitOptions.rhinoAttachment,
            altTextEditor: this.altTextEditor,
          },
        };
      }
    }

    if (!this.hasInitialized) {
      return super.updated(changedProperties);
    }

    if (changedProperties.has("translations")) {
      const { rhinoAttachment, rhinoPlaceholder } = this.starterKitOptions;

      if (rhinoPlaceholder) {
        rhinoPlaceholder.placeholder = this.translations.placeholder;
      }

      if (rhinoAttachment) {
        rhinoAttachment.captionPlaceholder =
          this.translations.captionPlaceholder;
        rhinoAttachment.fileUploadErrorMessage =
          this.translations.fileUploadErrorMessage;
      }
    }

    return super.updated(changedProperties);
  }

  /**
   * @override
   */
  async connectedCallback() {
    super.connectedCallback();

    await this.updateComplete;

    this.starterKitOptions = Object.assign(this.starterKitOptions, {
      rhinoBubbleMenu: {
        ...this.starterKitOptions.rhinoBubbleMenu,
        element: this.shadowRoot?.querySelector("role-anchored-region"),
      },
    }) as typeof this.starterKitOptions;

    document.addEventListener("click", this.__handleLinkDialogClick);
  }

  /**
   * @override
   */
  async startEditor() {
    await super.startEditor();

    if (this.editor) {
      this.editor.on("focus", this.closeLinkDialog);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("click", this.__handleLinkDialogClick);
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
    this.linkDialogExpanded = false;
    this.editor?.commands.focus();
  }

  showLinkDialog(): void {
    const inputElement = this.linkInputRef.value;

    if (inputElement != null) {
      inputElement.value = this.editor?.getAttributes("link").href || "";
      inputElement.setSelectionRange(0, inputElement.value.length);
    }

    this.__invalidLink__ = false;
    this.linkDialogExpanded = true;
    setTimeout(() => {
      requestAnimationFrame(() => {
        if (inputElement != null) {
          inputElement.focus();
        }
      });
    });
  }

  get linkDialog(): Maybe<HTMLDivElement> {
    return this.shadowRoot?.querySelector<HTMLDivElement>("#link-dialog");
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
      inputElement.reportValidity();
      return;
    }

    if (!this.editor) {
      return;
    }

    if (href) {
      this.closeLinkDialog();
      inputElement.value = "";

      if (
        this.editor.state.selection.empty &&
        !this.editor.getAttributes("link").href
      ) {
        const from = this.editor.state.selection.anchor;
        this.editor.commands.insertContent(href);
        const to = this.editor.state.selection.anchor;
        this.editor.commands.setTextSelection({ from, to });
      }

      this.editor?.chain().extendMarkRange("link").setLink({ href }).run();
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

    const attachments = await this.handleFiles(input.files);

    if (attachments.length > 0) {
      this.editor?.chain().focus().setAttachment(attachments).run();
    }

    input.value = "";
  }

  private get __tooltipExportParts() {
    return "base:toolbar__tooltip__base, arrow:toolbar__tooltip__arrow";
  }

  renderBoldButton(prefix = "") {
    const boldEnabled =
      this.starterKitOptions.bold !== false ||
      Boolean(this.editor?.commands.toggleBold);

    if (!boldEnabled) return html``;

    const isDisabled = this.editor == null || !this.editor.can().toggleBold();
    const isActive = Boolean(this.editor?.isActive("bold"));

    let tooltip_slot_name = "bold-tooltip";
    let tooltip_id = "bold";
    let tooltip_parts = "toolbar__tooltip toolbar__tooltip--bold";
    let icon_slot_name = "bold-icon";

    if (prefix) {
      tooltip_slot_name = prefix + "__" + tooltip_slot_name;
      icon_slot_name = prefix + "__" + icon_slot_name;
      tooltip_id = prefix + "__" + tooltip_id;
    }

    return html`
      <slot name=${tooltip_slot_name}>
        <role-tooltip
          id=${tooltip_id}
          part=${tooltip_parts}
          exportparts=${this.__tooltipExportParts}
        >
          ${this.translations.bold}
        </role-tooltip>
      </slot>
      <button
        class="toolbar__button rhino-toolbar-button"
        type="button"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--bold": true,
          "toolbar__button--active": isActive,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-disabled=${isDisabled}
        aria-pressed=${isActive}
        data-role="toolbar-item"
        data-role-tooltip=${tooltip_id}
        @click=${async (e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) return;
          this.editor?.chain().focus().toggleBold().run();
        }}
      >
        <slot name=${icon_slot_name}>${this.icons.bold}</slot>
      </button>
    `;
  }

  renderItalicButton(prefix = "") {
    const italicEnabled =
      this.starterKitOptions.italic !== false ||
      Boolean(this.editor?.commands.toggleItalic);

    if (!italicEnabled) return html``;

    const isActive = Boolean(this.editor?.isActive("italic"));
    const isDisabled = this.editor == null || !this.editor.can().toggleItalic();

    let tooltip_slot_name = "italics-tooltip";
    let tooltip_id = "italics";
    let tooltip_parts = "toolbar__tooltip toolbar__tooltip--italics";
    let icon_slot_name = "italics-icon";

    if (prefix) {
      tooltip_slot_name = prefix + "__" + tooltip_slot_name;
      icon_slot_name = prefix + "__" + icon_slot_name;
      tooltip_id = prefix + "__" + tooltip_id;
    }

    return html`
      <slot name=${tooltip_slot_name}>
        <role-tooltip
          id=${tooltip_id}
          part=${tooltip_parts}
          exportparts=${this.__tooltipExportParts}
        >
          ${this.translations.italics}
        </role-tooltip>
      </slot>
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
        aria-disabled=${isDisabled}
        aria-pressed=${isActive}
        data-role="toolbar-item"
        data-role-tooltip=${tooltip_id}
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
            return;
          }

          this.editor?.chain().focus().toggleItalic().run();
        }}
      >
        <slot name=${icon_slot_name}> ${this.icons.italics} </slot>
      </button>
    `;
  }

  renderStrikeButton(prefix = "") {
    const strikeEnabled =
      this.starterKitOptions.rhinoStrike !== false ||
      Boolean(this.editor?.commands.toggleStrike);

    if (!strikeEnabled) return html``;

    const isActive = Boolean(this.editor?.isActive("rhino-strike"));
    const isDisabled = this.editor == null || !this.editor.can().toggleStrike();

    let tooltip_slot_name = "strike-tooltip";
    let tooltip_id = "strike";
    let tooltip_parts = "toolbar__tooltip toolbar__tooltip--strike";
    let icon_slot_name = "strike-icon";

    if (prefix) {
      tooltip_slot_name = prefix + "__" + tooltip_slot_name;
      icon_slot_name = prefix + "__" + icon_slot_name;
      tooltip_id = prefix + "__" + tooltip_id;
    }

    return html`
      <slot name=${tooltip_slot_name}>
        <role-tooltip
          id=${tooltip_id}
          part=${tooltip_parts}
          exportparts=${this.__tooltipExportParts}
        >
          ${this.translations.strike}
        </role-tooltip>
      </slot>
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
        aria-disabled=${isDisabled}
        aria-pressed=${isActive}
        data-role-tooltip=${tooltip_id}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
            return;
          }
          this.editor?.chain().focus().toggleStrike().run();
        }}
      >
        <slot name=${icon_slot_name}>${this.icons.strike}</slot>
      </button>
    `;
  }

  renderLinkButton(prefix = "") {
    const linkEnabled =
      this.starterKitOptions.rhinoLink !== false ||
      Boolean(this.editor?.commands.setLink);

    if (!linkEnabled) return html``;

    const isActive = Boolean(
      this.editor?.isActive("link") || this.linkDialogExpanded,
    );
    const isDisabled =
      this.editor == null || !this.editor.can().setLink({ href: "" });

    let tooltip_slot_name = "link-tooltip";
    let tooltip_id = "link";
    let tooltip_parts = "toolbar__tooltip toolbar__tooltip--link";
    let icon_slot_name = "link-icon";

    if (prefix) {
      tooltip_slot_name = prefix + "__" + tooltip_slot_name;
      icon_slot_name = prefix + "__" + icon_slot_name;
      tooltip_id = prefix + "__" + tooltip_id;
    }

    return html`
      <slot name=${tooltip_slot_name}>
        <role-tooltip
          id=${tooltip_id}
          part=${tooltip_parts}
          exportparts=${this.__tooltipExportParts}
        >
          ${this.translations.link}
        </role-tooltip>
      </slot>
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
        aria-disabled=${isDisabled}
        aria-pressed=${isActive}
        aria-controls="link-dialog"
        data-role="toolbar-item"
        data-role-tooltip=${tooltip_id}
        @click=${(e: MouseEvent) => {
          if (this.editor == null) return;
          if (elementDisabled(e.currentTarget)) return;

          e.preventDefault();
          this.toggleLinkDialog();
        }}
      >
        <slot name=${icon_slot_name}>${this.icons.link}</slot>
      </button>
    `;
  }

  renderHeadingButton(prefix = "") {
    const headingEnabled =
      this.starterKitOptions.heading !== false ||
      Boolean(this.editor?.commands.toggleHeading);

    if (!headingEnabled) return html``;

    const defaultHeadingLevel = this.defaultHeadingLevel || 1;

    const isActive = Boolean(this.editor?.isActive("heading"));
    const isDisabled =
      this.editor == null ||
      !this.editor.can().toggleHeading({ level: defaultHeadingLevel });

    let tooltip_slot_name = "heading-tooltip";
    let tooltip_id = "heading";
    let tooltip_parts = "toolbar__tooltip toolbar__tooltip--heading";
    let icon_slot_name = "heading-icon";

    if (prefix) {
      icon_slot_name = prefix + "__" + icon_slot_name;
      tooltip_slot_name = prefix + "__" + tooltip_slot_name;
      tooltip_id = prefix + "__" + tooltip_id;
    }

    return html`
      <slot name=${tooltip_slot_name}>
        <role-tooltip
          id=${tooltip_id}
          part=${tooltip_parts}
          exportparts=${this.__tooltipExportParts}
        >
          ${this.translations.heading}
        </role-tooltip>
      </slot>
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
        aria-disabled=${isDisabled}
        aria-pressed=${isActive}
        data-role="toolbar-item"
        data-role-tooltip=${tooltip_id}
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
            return;
          }

          this.editor
            ?.chain()
            .focus()
            .toggleHeading({ level: defaultHeadingLevel })
            .run();
        }}
      >
        <slot name=${icon_slot_name}>${this.icons.heading}</slot>
      </button>
    `;
  }

  renderBlockquoteButton(prefix = "") {
    const blockQuoteEnabled =
      this.starterKitOptions.blockquote !== false ||
      Boolean(this.editor?.commands.toggleBlockquote);

    if (!blockQuoteEnabled) return html``;

    const isActive = Boolean(this.editor?.isActive("blockquote"));
    const isDisabled =
      this.editor == null || !this.editor.can().toggleBlockquote();

    let tooltip_slot_name = "blockquote-tooltip";
    let tooltip_id = "blockquote";
    let tooltip_parts = "toolbar__tooltip toolbar__tooltip--blockquote";
    let icon_slot_name = "blockquote-icon";

    if (prefix) {
      icon_slot_name = prefix + "__" + icon_slot_name;
      tooltip_slot_name = prefix + "__" + tooltip_slot_name;
      tooltip_id = prefix + "__" + tooltip_id;
    }

    return html`
      <slot name=${tooltip_slot_name}>
        <role-tooltip
          id=${tooltip_id}
          part=${tooltip_parts}
          exportparts=${this.__tooltipExportParts}
        >
          ${this.translations.blockQuote}
        </role-tooltip>
      </slot>
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
        aria-disabled=${isDisabled}
        aria-pressed=${isActive}
        data-role-tooltip=${tooltip_id}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
            return;
          }

          this.editor?.chain().focus().toggleBlockquote().run();
        }}
      >
        <slot name=${icon_slot_name}>${this.icons.blockQuote}</slot>
      </button>
    `;
  }

  renderCodeButton(prefix = "") {
    const codeEnabled =
      this.starterKitOptions.code !== false ||
      Boolean(this.editor?.commands.toggleCode);

    if (!codeEnabled) return html``;

    const isActive = Boolean(this.editor?.isActive("code"));
    const isDisabled = this.editor == null || !this.editor.can().toggleCode();

    let tooltip_slot_name = "code-tooltip";
    let tooltip_id = "code";
    let tooltip_parts = "toolbar__tooltip toolbar__tooltip--code";
    let icon_slot_name = "code-icon";

    if (prefix) {
      icon_slot_name = prefix + "__" + icon_slot_name;
      tooltip_slot_name = prefix + "__" + tooltip_slot_name;
      tooltip_id = prefix + "__" + tooltip_id;
    }

    return html`
      <slot name=${tooltip_slot_name}>
        <role-tooltip
          id=${tooltip_id}
          part=${tooltip_parts}
          exportparts=${this.__tooltipExportParts}
        >
          ${this.translations.code}
        </role-tooltip>
      </slot>
      <button
        class="toolbar__button rhino-toolbar-button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--code": true,
          "toolbar__button--active": isActive,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-disabled=${isDisabled}
        aria-pressed=${isActive}
        data-role-tooltip=${tooltip_id}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
            return;
          }
          this.editor?.chain().focus().toggleCode().run();
        }}
      >
        <slot name=${icon_slot_name}>${this.icons.code}</slot>
      </button>
    `;
  }

  renderCodeBlockButton(prefix = "") {
    const codeBlockEnabled =
      this.starterKitOptions.codeBlock !== false ||
      Boolean(this.editor?.commands.toggleCodeBlock);

    if (!codeBlockEnabled) return html``;

    const isActive = Boolean(this.editor?.isActive("codeBlock"));
    const isDisabled =
      this.editor == null || !this.editor.can().toggleCodeBlock();

    let tooltip_slot_name = "code-block-tooltip";
    let tooltip_id = "code-block";
    let tooltip_parts = "toolbar__tooltip toolbar__tooltip--code-block";
    let icon_slot_name = "code-block-icon";

    if (prefix) {
      icon_slot_name = prefix + "__" + icon_slot_name;
      tooltip_slot_name = prefix + "__" + tooltip_slot_name;
      tooltip_id = prefix + "__" + tooltip_id;
    }

    return html`
      <slot name=${tooltip_slot_name}>
        <role-tooltip
          id=${tooltip_id}
          part=${tooltip_parts}
          exportparts=${this.__tooltipExportParts}
        >
          ${this.translations.codeBlock}
        </role-tooltip>
      </slot>
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
        aria-disabled=${isDisabled}
        aria-pressed=${isActive}
        data-role-tooltip=${tooltip_id}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
            return;
          }
          this.editor?.chain().focus().toggleCodeBlock().run();
        }}
      >
        <slot name=${icon_slot_name}>${this.icons.codeBlock}</slot>
      </button>
    `;
  }

  renderBulletListButton(prefix = "") {
    const bulletListEnabled =
      this.starterKitOptions.bulletList !== false ||
      Boolean(this.editor?.commands.toggleBulletList);

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

    let tooltip_slot_name = "bullet-list-tooltip";
    let tooltip_id = "bullet-list";
    let tooltip_parts = "toolbar__tooltip toolbar__tooltip--bullet-list";
    let icon_slot_name = "bullet-list-icon";

    if (prefix) {
      icon_slot_name = prefix + "__" + icon_slot_name;
      tooltip_slot_name = prefix + "__" + tooltip_slot_name;
      tooltip_id = prefix + "__" + tooltip_id;
    }

    return html`
      <slot name=${tooltip_slot_name}>
        <role-tooltip
          id=${tooltip_id}
          part=${tooltip_parts}
          exportparts=${this.__tooltipExportParts}
        >
          ${this.translations.bulletList}
        </role-tooltip>
      </slot>
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
        aria-disabled=${isDisabled}
        aria-pressed=${isActive}
        data-role-tooltip=${tooltip_id}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
            return;
          }
          this.editor?.chain().focus().toggleBulletList().run();
        }}
      >
        <slot name=${icon_slot_name}>${this.icons.bulletList}</slot>
      </button>
    `;
  }

  renderOrderedListButton(prefix = "") {
    const orderedListEnabled =
      this.starterKitOptions.orderedList !== false ||
      Boolean(this.editor?.commands.toggleOrderedList);

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

    let tooltip_slot_name = "ordered-list-tooltip";
    let tooltip_id = "ordered-list";
    let tooltip_parts = "toolbar__tooltip toolbar__tooltip--ordered-list";
    let icon_slot_name = "ordered-list-icon";

    if (prefix) {
      icon_slot_name = prefix + "__" + icon_slot_name;
      tooltip_slot_name = prefix + "__" + tooltip_slot_name;
      tooltip_id = prefix + "__" + tooltip_id;
    }

    return html`
      <slot name=${tooltip_slot_name}>
        <role-tooltip
          id=${tooltip_id}
          part=${tooltip_parts}
          exportparts=${this.__tooltipExportParts}
        >
          ${this.translations.orderedList}
        </role-tooltip>
      </slot>
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
        aria-disabled=${isDisabled}
        aria-pressed=${isActive}
        data-role-tooltip=${tooltip_id}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
            return;
          }

          this.editor?.chain().focus().toggleOrderedList().run();
        }}
      >
        <slot name=${icon_slot_name}>${this.icons.orderedList}</slot>
      </button>
    `;
  }

  renderAttachmentButton(prefix = "") {
    const attachmentEnabled =
      this.starterKitOptions.rhinoAttachment !== false ||
      Boolean(this.editor?.commands.setAttachment);

    if (!attachmentEnabled) return html``;

    const isDisabled = this.editor == null;

    let tooltip_slot_name = "attach-files-tooltip";
    let tooltip_id = "attach-files";
    let tooltip_parts = "toolbar__tooltip toolbar__tooltip--attach-files";
    let icon_slot_name = "attach-files-icon";
    let file_input_id = "file-input";

    if (prefix) {
      icon_slot_name = prefix + "__" + icon_slot_name;
      tooltip_slot_name = prefix + "__" + tooltip_slot_name;
      tooltip_id = prefix + "__" + tooltip_id;
      file_input_id = prefix + "__" + file_input_id;
    }

    return html`
      <slot name=${tooltip_slot_name}>
        <role-tooltip
          id=${tooltip_id}
          part=${tooltip_parts}
          exportparts=${this.__tooltipExportParts}
        >
          ${this.translations.attachFiles}
        </role-tooltip>
      </slot>
      <button
        class="toolbar__button rhino-toolbar-button"
        tabindex="-1"
        type="button"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--attach-files": true,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-disabled=${isDisabled}
        data-role-tooltip=${tooltip_id}
        data-role="toolbar-item"
        @click=${this.attachFiles}
      >
        <slot name=${icon_slot_name}>${this.icons.attachFiles}</slot>

        <!-- @TODO: Write documentation. Hookup onchange to the slotted elements? -->
        <slot name="attach-files-input">
          <input
            id=${file_input_id}
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

  renderUndoButton(prefix = "") {
    const undoEnabled =
      this.starterKitOptions.undoRedo !== false ||
      Boolean(this.editor?.commands.undo);

    if (!undoEnabled) return html``;

    const isDisabled = this.editor == null || !this.editor.can().undo();

    let tooltip_slot_name = "undo-tooltip";
    let tooltip_id = "undo";
    let tooltip_parts = "toolbar__tooltip toolbar__tooltip--undo";
    let icon_slot_name = "undo-icon";

    if (prefix) {
      icon_slot_name = prefix + "__" + icon_slot_name;
      tooltip_slot_name = prefix + "__" + tooltip_slot_name;
      tooltip_id = prefix + "__" + tooltip_id;
    }

    return html`
      <slot name=${tooltip_slot_name}>
        <role-tooltip
          id=${tooltip_id}
          part=${tooltip_parts}
          exportparts=${this.__tooltipExportParts}
        >
          ${this.translations.undo}
        </role-tooltip>
      </slot>
      <button
        class="toolbar__button rhino-toolbar-button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--undo": true,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-disabled=${isDisabled}
        data-role-tooltip=${tooltip_id}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
            return;
          }
          this.editor?.chain().focus().undo().run();
        }}
      >
        <slot name=${icon_slot_name}>${this.icons.undo}</slot>
      </button>
    `;
  }

  renderDecreaseIndentation(prefix = "") {
    // Decrease / increase indentation are special cases in that they rely on built-in editor
    // commands and not commands added by extensions.
    const decreaseIndentationEnabled =
      this.starterKitOptions.decreaseIndentation !== false; // || Boolean(this.editor?.commands.liftListItem);

    if (!decreaseIndentationEnabled) return html``;

    const isDisabled =
      this.editor == null || !this.editor.can().liftListItem("listItem");

    let tooltip_slot_name = "decrease-indentation-tooltip";
    let tooltip_id = "decrease-indentation";
    let tooltip_parts =
      "toolbar__tooltip toolbar__tooltip--decrease-indentation";
    let icon_slot_name = "decrease-indentation-icon";

    if (prefix) {
      icon_slot_name = prefix + "__" + icon_slot_name;
      tooltip_slot_name = prefix + "__" + tooltip_slot_name;
      tooltip_id = prefix + "__" + tooltip_id;
    }

    return html`
      <slot name=${tooltip_slot_name}>
        <role-tooltip
          id=${tooltip_id}
          part=${tooltip_parts}
          exportparts=${this.__tooltipExportParts}
        >
          ${this.translations.decreaseIndentation}
        </role-tooltip>
      </slot>
      <button
        class="toolbar__button rhino-toolbar-button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--decrease-indentation": true,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-disabled=${isDisabled}
        data-role-tooltip=${tooltip_id}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
            return;
          }
          this.editor?.chain().focus().liftListItem("listItem").run();
        }}
      >
        <slot name=${icon_slot_name}> ${this.icons.decreaseIndentation} </slot>
      </button>
    `;
  }

  renderIncreaseIndentation(prefix = "") {
    // Decrease / increase indentation are special cases in that they rely on built-in editor
    // commands and not commands added by extensions.
    const increaseIndentationEnabled =
      this.starterKitOptions.increaseIndentation !== false; // || Boolean(this.editor?.commands.sinkListItem);

    if (!increaseIndentationEnabled) return html``;

    const isDisabled =
      this.editor == null || !this.editor.can().sinkListItem("listItem");

    let tooltip_slot_name = "increase-indentation-tooltip";
    let tooltip_id = "increase-indentation";
    let tooltip_parts =
      "toolbar__tooltip toolbar__tooltip--increase-indentation";
    let icon_slot_name = "increase-indentation-icon";

    if (prefix) {
      icon_slot_name = prefix + "__" + icon_slot_name;
      tooltip_slot_name = prefix + "__" + tooltip_slot_name;
      tooltip_id = prefix + "__" + tooltip_id;
    }

    return html`
      <slot name=${tooltip_slot_name}>
        <role-tooltip
          id=${tooltip_id}
          part=${tooltip_parts}
          exportparts=${this.__tooltipExportParts}
        >
          ${this.translations.increaseIndentation}
        </role-tooltip>
      </slot>
      <button
        class="toolbar__button rhino-toolbar-button"
        type="button"
        tabindex="-1"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--increase-indentation": true,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-disabled=${isDisabled}
        data-role-tooltip=${tooltip_id}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
            return;
          }
          this.editor?.chain().focus().sinkListItem("listItem").run();
        }}
      >
        <slot name=${icon_slot_name}> ${this.icons.increaseIndentation} </slot>
      </button>
    `;
  }

  renderRedoButton(prefix = "") {
    const redoEnabled =
      this.starterKitOptions.undoRedo !== false ||
      Boolean(this.editor?.commands.redo);

    if (!redoEnabled) return html``;

    const isDisabled = this.editor == null || !this.editor.can().redo?.();

    let tooltip_slot_name = "redo-indentation-tooltip";
    let tooltip_id = "redo-indentation";
    let tooltip_parts = "toolbar__tooltip toolbar__tooltip--redo-indentation";
    let icon_slot_name = "redo-indentation-icon";

    if (prefix) {
      icon_slot_name = prefix + "__" + icon_slot_name;
      tooltip_slot_name = prefix + "__" + tooltip_slot_name;
      tooltip_id = prefix + "__" + tooltip_id;
    }

    return html`
      <slot name=${tooltip_slot_name}>
        <role-tooltip
          id=${tooltip_id}
          part=${tooltip_parts}
          exportparts=${this.__tooltipExportParts}
        >
          ${this.translations.redo}
        </role-tooltip>
      </slot>
      <button
        class="toolbar__button rhino-toolbar-button"
        tabindex="-1"
        type="button"
        part=${stringMap({
          toolbar__button: true,
          "toolbar__button--redo": true,
          "toolbar__button--disabled": isDisabled,
        })}
        aria-disabled=${isDisabled}
        data-role-tooltip=${tooltip_id}
        data-role="toolbar-item"
        @click=${(e: MouseEvent) => {
          if (elementDisabled(e.currentTarget)) {
            return;
          }
          this.editor?.chain().focus().redo().run();
        }}
      >
        <slot name=${icon_slot_name}>${this.icons.redo}</slot>
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
        <role-toolbar
          part="toolbar main__toolbar"
          role="toolbar"
          exportparts="
            base:toolbar__base,
            base:main__toolbar__base
          "
        >
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

          <!-- Code -->
          <slot name="before-code-button"></slot>
          <slot name="code-button">${this.renderCodeButton()}</slot>
          <slot name="after-code-button"></slot>

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

      ${this.renderBubbleMenuToolbar()} ${this.renderLinkDialogAnchoredRegion()}
    `;
  }

  /**
   * @private
   */
  private __handleLinkDialogClick = (e: Event) => {
    if (e.defaultPrevented) {
      return;
    }

    const linkDialogContainer = this.shadowRoot?.querySelector(
      ".link-dialog__container",
    );

    if (!linkDialogContainer) {
      this.linkDialogExpanded = false;
      return;
    }

    const composedPath = e.composedPath();

    const linkButton = this.shadowRoot?.querySelector("[name='link-button']");

    if (composedPath.includes(linkDialogContainer as EventTarget)) {
      return;
    }

    if (linkButton && composedPath.includes(linkButton as EventTarget)) {
      return;
    }

    this.linkDialogExpanded = false;
  };

  renderLinkDialogAnchoredRegion() {
    const clientRect = this.linkDialogExpanded
      ? findElement(this.editor as Editor)
      : null;

    return html`
      <role-anchored-region
        part="link-bubble-menu__anchored-region"
        exportparts="
          popover-base:link-bubble-menu__popover-base,
          hover-bridge:link-bubble-menu__hover-bridge,
          hover-bridge--visible:link-bubble-menu__hover-bridge--visible,
          popover:link-bubble-menu__popover,
          popover--active:link-bubble-menu__popover--active,
          popover--fixed:link-bubble-menu__popover--fixed,
          popover--has-arrow:link-bubble-menu__popover--has-arrow,
          arrow:link-bubble-menu__arrow
        "
        anchored-popover-type="manual"
        distance="4"
        .active=${this.linkDialogExpanded}
        .shiftBoundary=${this.querySelector(".ProseMirror") || this}
        .flipBoundary=${this.querySelector(".ProseMirror") || this}
        .anchor=${typeof clientRect === "function"
          ? { getBoundingClientRect: clientRect }
          : null}
      >
        <slot name="link-bubble-menu-dialog"> ${this.renderLinkDialog()} </slot>
      </role-anchored-region>
    `;
  }

  /** @TODO: Lets think of a more friendly way to render dialogs for users to extend. */
  renderLinkDialog() {
    if (this.readonly) {
      return html``;
    }

    return html` <div
      id="link-dialog"
      part=${stringMap({
        "link-dialog": true,
        "link-dialog--expanded": this.linkDialogExpanded,
      })}
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
            class="rhino-toolbar-button link-dialog__button"
            part="link-dialog__button link-dialog__button--link"
            @click=${this.addLink}
          >
            ${this.translations.linkDialogLink}
          </button>
          <button
            class="rhino-toolbar-button link-dialog__button"
            part="link-dialog__button link-dialog__button--unlink"
            @click=${() => {
              this.linkDialogExpanded = false;
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

  /**
   * Returns the bubble menu toolbar from the shadow root.
   */
  get defaultBubbleMenuToolbar(): RoleToolbar | null | undefined {
    return this.shadowRoot?.querySelector<RoleToolbar>(
      "[part~='bubble-menu__toolbar']",
    );
  }

  renderBubbleMenuToolbar() {
    return html`
      <role-anchored-region
        part="bubble-menu__anchored-region"
        exportparts="
          popover-base:bubble-menu__popover-base,
          hover-bridge:bubble-menu__hover-bridge,
          hover-bridge--visible:bubble-menu__hover-bridge--visible,
          popover:bubble-menu__popover,
          popover--active:bubble-menu__popover--active,
          popover--fixed:bubble-menu__popover--fixed,
          popover--has-arrow:bubble-menu__popover--has-arrow,
          arrow:bubble-menu__arrow
        "
        @rhino-bubble-menu-show=${(
          e: Event & { clientRect: () => DOMRect },
        ) => {
          if (e.defaultPrevented) {
            return;
          }

          const anchoredRegion = e.currentTarget as RoleAnchoredRegion;
          anchoredRegion.anchor = { getBoundingClientRect: e.clientRect };
          anchoredRegion.shiftBoundary =
            this.querySelector(".ProseMirror") || this;
          anchoredRegion.flipBoundary =
            this.querySelector(".ProseMirror") || this;
          anchoredRegion.active = true;
        }}
        @rhino-bubble-menu-hide=${(e: Event) => {
          if (e.defaultPrevented) {
            return;
          }

          const anchoredRegion = e.currentTarget as RoleAnchoredRegion;
          anchoredRegion.anchor = null;
          anchoredRegion.active = false;
        }}
        anchored-popover-type="manual"
        distance="4"
      >
        <slot name="bubble-menu-toolbar">
          <role-toolbar
            part="toolbar bubble-menu__toolbar"
            role="toolbar"
            exportparts="
              base:toolbar__base,
              base:bubble-menu__toolbar__base
            "
          >
            <slot name="before-bubble-menu-toolbar-items"></slot>
            <slot name="bubble-menu-toolbar-items">
              ${this.renderBoldButton("bubble-menu")}
              ${this.renderItalicButton("bubble-menu")}
              ${this.renderStrikeButton("bubble-menu")}
              ${this.renderCodeButton("bubble-menu")}
              ${this.renderLinkButton("bubble-menu")}
            </slot>
            <slot name="after-bubble-menu-toolbar-items"></slot>
          </role-toolbar>
        </slot>
        <slot name="additional-bubble-menu-toolbar"></slot>
      </role-anchored-region>
    `;
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
