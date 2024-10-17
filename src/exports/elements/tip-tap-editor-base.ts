import { BaseElement } from "../../internal/elements/base-element.js";
import { AnyExtension, Content, Editor, EditorOptions } from "@tiptap/core";
import { tipTapCoreStyles } from "../styles/tip-tap-core-styles.js";
// https://tiptap.dev/api/extensions/starter-kit#included-extensions
import StarterKit, { StarterKitOptions } from "@tiptap/starter-kit";
import {
  RhinoStarterKit,
  RhinoStarterKitOptions,
} from "../extensions/rhino-starter-kit.js";

import {
  CSSResult,
  html,
  PropertyDeclarations,
  PropertyValueMap,
  TemplateResult,
} from "lit";

import { AttachmentUpload } from "../attachment-upload.js";
import { AttachmentManager } from "../attachment-manager.js";

import { normalize } from "../styles/normalize.js";
import editorStyles from "../styles/editor.js";

import { AddAttachmentEvent } from "../events/add-attachment-event.js";

import type { Maybe } from "../../types.js";
import { AttachmentEditor } from "./attachment-editor.js";
import { FileAcceptEvent } from "../events/file-accept-event.js";
import { BeforeInitializeEvent } from "../events/before-initialize-event.js";
import { InitializeEvent } from "../events/initialize-event.js";
import { RhinoFocusEvent } from "../events/rhino-focus-event.js";
import { RhinoBlurEvent } from "../events/rhino-blur-event.js";
import { RhinoChangeEvent } from "../events/rhino-change-event.js";
import { SelectionChangeEvent } from "../events/selection-change-event.js";
import { RhinoPasteEvent } from "../events/rhino-paste-event.js";
import { DOMSerializer, Slice } from "@tiptap/pm/model";
import type { EditorView } from "@tiptap/pm/view";

export type Serializer = "" | "html" | "json";

export type RhinoEditorStarterKitOptions = StarterKitOptions &
  RhinoStarterKitOptions & {
    // Indentation is a special case because it uses built-in editor commands and doesn't rely on extensions.
    increaseIndentation: boolean;
    decreaseIndentation: boolean;
  };

export class TipTapEditorBase extends BaseElement {
  // Static

  /**
   * Default registration name
   */
  static baseName = "rhino-editor";

  static get styles(): CSSResult[] {
    return [normalize, tipTapCoreStyles, editorStyles];
  }

  static get properties(): PropertyDeclarations {
    return {
      // Attributes
      readonly: { type: Boolean, reflect: true },
      input: { reflect: true },
      class: { reflect: true },
      accept: { reflect: true },
      serializer: { reflect: true },
      deferInitialize: {
        type: Boolean,
        attribute: "defer-initialize",
        reflect: true,
      },

      // Properties
      editor: { state: true },
      editorElement: { state: true },
      starterKitOptions: { state: true },
      extensions: { state: true },
    };
  }

  // Instance

  /**
   * Whether or not the editor should be editable.
   *
   * NOTE: a user can change this in the browser dev tools, don't rely on this to prevent
   * users from editing and attempting to save the document.
   */
  readonly: boolean = false;

  /**
   * Prevents premature rebuilds.
   */
  hasInitialized = false;

  /**
   * The hidden input to attach to
   */
  input: Maybe<string>;

  /**
   * The currently attached TipTap instance
   */
  editor: Maybe<Editor>;

  /**
   * The element that TipTap is attached to
   */
  editorElement: Maybe<Element>;

  /**
   * JSON or HTML serializer used for determining the string to write to the hidden input.
   */
  serializer: Serializer = "html";

  /** Comma separated string passed to the attach-files input. */
  accept: string = "*";

  starterKitOptions: Partial<RhinoEditorStarterKitOptions> = {
    // We don't use the native strike since it requires configuring ActionText.
    strike: false,
    rhinoLink: {
      openOnClick: false,
    },
  };

  /**
   * This will be concatenated onto RhinoStarterKit and StarterKit extensions.
   */
  extensions: EditorOptions["extensions"] = [];

  /**
   * When the `defer-initialize` attribute is present, it will wait to start the TipTap editor until the attribute has been removed.
   */
  deferInitialize = false;

  /**
   * @internal
   */
  __initialAttributes: Record<string, string> = {};

  /**
   * @internal
   */
  __hasRendered: boolean = false;

  __getInitialAttributes() {
    if (this.__hasRendered) return;

    const slottedEditor = this.slottedEditor;
    if (slottedEditor) {
      this.__initialAttributes = {};
      [...slottedEditor.attributes].forEach((attr) => {
        const { nodeName, nodeValue } = attr;
        if (nodeName && nodeValue != null) {
          this.__initialAttributes[nodeName] = nodeValue;
        }
      });
    }

    this.__hasRendered = true;
  }

  /**
   * Reset mechanism. This is called on first connect, and called anytime extensions,
   * or editor options get modified to make sure we have a fresh instance.
   */
  rebuildEditor() {
    if (!this.hasInitialized) return;

    const editors = this.querySelectorAll("[slot='editor']");

    this.__getInitialAttributes();

    // Make sure we dont render the editor more than once.
    if (this.editor) this.editor.destroy();

    editors.forEach((el) => {
      // @ts-expect-error
      el.editor?.destroy();
      el.remove();
    });

    this.editor = this.__setupEditor(this);

    this.__bindEditorListeners();

    this.editorElement = this.querySelector(".ProseMirror");

    Object.entries(this.__initialAttributes)?.forEach(
      ([attrName, attrValue]) => {
        if (attrName === "class") {
          this.editorElement?.classList.add(...attrValue.split(" "));
          return;
        }
        this.editorElement?.setAttribute(attrName, attrValue);
      },
    );

    this.editorElement?.setAttribute("slot", "editor");
    this.editorElement?.classList.add("trix-content");
    this.editorElement?.setAttribute("tabindex", "0");
    this.editorElement?.setAttribute("role", "textbox");

    // For good measure for rendering.
    this.requestUpdate();
  }

  /**
   * Grabs HTML content based on a given range. If no range is given, it will return the contents
   *   of the current editor selection. If the current selection is empty, it will return an empty string.
   * @param from - The start of the selection
   * @param to - The end of the selection
   * @example Getting the HTML content of the current selection
   *    const rhinoEditor = document.querySelector("rhino-editor")
   *    rhinoEditor.getHTMLContentFromRange()
   *
   * @example Getting the HTML content of node range
   *    const rhinoEditor = document.querySelector("rhino-editor")
   *    rhinoEditor.getHTMLContentFromRange(0, 50)
   *
   * @example Getting the HTML content and falling back to entire editor HTML
   *    const rhinoEditor = document.querySelector("rhino-editor")
   *    let html = rhinoEditor.getHTMLContentFromRange()
   *    if (!html) {
   *       html = rhinoEditor.editor.getHTML()
   *    }
   */
  getHTMLContentFromRange(from?: number, to?: number) {
    const editor = this.editor;

    if (!editor) return "";

    let empty;

    if (!from && !to) {
      const currentSelection = editor.state.selection;

      from = currentSelection.from;
      to = currentSelection.to;
    }

    if (empty) {
      return "";
    }
    if (from == null) {
      return "";
    }
    if (to == null) {
      return "";
    }

    const { state } = editor;
    const htmlArray: string[] = [];

    const tempScript = document.createElement("script");
    // We want plain text so we don't parse.
    tempScript.type = "text/plain";

    state.doc.nodesBetween(from, to, (node, _pos, parent) => {
      if (parent === state.doc) {
        tempScript.innerHTML = "";
        const serializer = DOMSerializer.fromSchema(editor.schema);
        const dom = serializer.serializeNode(node);
        tempScript.appendChild(dom);
        htmlArray.push(tempScript.innerHTML);
        tempScript.innerHTML = "";
      }
    });

    return htmlArray.join("");
  }

  /**
   * Grabs plain text representation based on a given range. If no parameters are given, it will return the contents
   *   of the current selection. If the current selection is empty, it will return an empty string.
   * @param from - The start of the selection
   * @param to - The end of the selection
   * @example Getting the Text content of the current selection
   *    const rhinoEditor = document.querySelector("rhino-editor")
   *    rhinoEditor.getTextContentFromRange()
   *
   * @example Getting the Text content of node range
   *    const rhinoEditor = document.querySelector("rhino-editor")
   *    rhinoEditor.getTextContentFromRange(0, 50)
   *
   * @example Getting the Text content and falling back to entire editor Text
   *    const rhinoEditor = document.querySelector("rhino-editor")
   *    let text = rhinoEditor.getTextContentFromRange()
   *    if (!text) {
   *       text = rhinoEditor.editor.getText()
   *    }
   */
  getTextContentFromRange(from?: number, to?: number) {
    const editor = this.editor;

    if (!editor) {
      return "";
    }

    let empty;

    if (!from && !to) {
      const selection = editor.state.selection;
      from = selection.from;
      to = selection.to;
      empty = selection.empty;
    }

    if (empty) {
      return "";
    }
    if (from == null) {
      return "";
    }
    if (to == null) {
      return "";
    }

    return editor.state.doc.textBetween(from, to, " ");
  }

  protected willUpdate(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
  ): void {
    if (changedProperties.has("deferInitialize") && !this.deferInitialize) {
      this.startEditor();
    }

    if (changedProperties.has("class")) {
      this.classList.add("rhino-editor");
    }

    super.willUpdate(changedProperties);
  }

  protected updated(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
  ): void {
    if (!this.hasInitialized) {
      return super.updated(changedProperties);
    }

    if (changedProperties.has("readonly")) {
      this.editor?.setEditable(!this.readonly);
    }

    if (
      changedProperties.has("extensions") ||
      changedProperties.has("serializer") ||
      changedProperties.has("starterKitOptions") ||
      changedProperties.has("translations")
    ) {
      this.rebuildEditor();
    }

    if (changedProperties.has("serializer")) {
      this.updateInputElementValue();
    }

    super.updated(changedProperties);
    this.dispatchEvent(
      new Event("rhino-update", {
        bubbles: true,
        composed: true,
        cancelable: false,
      }),
    );
  }

  /** Used for registering things like <role-toolbar>, <role-tooltip>, <rhino-attachment-editor> */
  registerDependencies() {
    [AttachmentEditor].forEach((el) => el.define());
  }

  get slottedEditor() {
    return this.querySelector("[slot='editor']");
  }

  constructor() {
    super();

    this.registerDependencies();
    this.addEventListener(AddAttachmentEvent.eventName, this.handleAttachment);

    this.addEventListener("drop", this.handleNativeDrop);
    this.addEventListener("rhino-paste", this.handlePaste);
    this.addEventListener("rhino-file-accept", this.handleFileAccept);
  }

  async connectedCallback(): Promise<void> {
    super.connectedCallback();

    this.__setupInitialization__();

    if (this.editor) {
      this.__unBindEditorListeners();
    }

    this.classList.add("rhino-editor");

    if (!this.deferInitialize) {
      this.startEditor();
    }
  }

  async startEditor() {
    await this.updateComplete;

    setTimeout(() => {
      this.dispatchEvent(new BeforeInitializeEvent());

      setTimeout(async () => {
        await this.updateComplete;
        this.hasInitialized = true;
        this.rebuildEditor();
        this.dispatchEvent(new InitializeEvent());
        this.__initializationResolver__?.();
      });
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    this.editor?.destroy();
    this.hasInitialized = false;
    this.__initializationPromise__ = null;
    this.__initializationResolver__ = null;
  }

  __initializationPromise__: null | Promise<void> = null;
  __initializationResolver__:
    | null
    | ((value: void | PromiseLike<void>) => void) = null;

  __setupInitialization__() {
    if (!this.__initializationPromise__) {
      this.__initializationPromise__ = new Promise<void>((resolve) => {
        this.__initializationResolver__ = resolve;
      });
    }
  }

  get initializationComplete() {
    this.__setupInitialization__();
    return this.__initializationPromise__;
  }

  /**
   * Used for determining how to handle uploads.
   *   Override this for substituting your own
   *   direct upload functionality.
   */
  handleAttachment = (event: AddAttachmentEvent) => {
    // To allow for event delegation to take effect, we wait until the next event loop to handle the attachment.
    setTimeout(() => {
      if (event.defaultPrevented) {
        return;
      }

      const { attachment, target } = event;

      if (target instanceof HTMLElement && attachment.file) {
        const upload = new AttachmentUpload(attachment, target);
        upload.start();
      }
    });
  };

  /** Override this to prevent specific file types from being uploaded. */
  handleFileAccept = (_event: FileAcceptEvent) => {};

  addExtensions(
    ...extensions:
      | EditorOptions["extensions"]
      | Array<EditorOptions["extensions"]>
  ) {
    const ary: EditorOptions["extensions"] = [];
    extensions.forEach((ext) => {
      if (Array.isArray(ext)) {
        ary.push(ext.flat(1) as unknown as AnyExtension);
        return;
      }

      ary.push(ext);
    });

    this.extensions = this.extensions.concat(ary);
  }

  disableStarterKitOptions(
    ...options:
      | Array<keyof RhinoStarterKitOptions>
      | Array<Array<keyof RhinoStarterKitOptions>>
  ) {
    const disabledStarterKitOptions: Record<string, false> = {};
    options.forEach((ext) => {
      if (Array.isArray(ext)) {
        ext.flat(1).forEach((str) => (disabledStarterKitOptions[str] = false));
        return;
      }

      disabledStarterKitOptions[ext] = false;
    });

    this.starterKitOptions = {
      ...this.starterKitOptions,
      ...disabledStarterKitOptions,
    };
  }

  /**
   * Extend this to provide your own options, or override existing options.
   * The "element" is where the editor will be initialized.
   * This will be merged
   *   @example
   *    class ExtendedRhinoEditor extends TipTapEditor {
   *      editorOptions (_element: Element) {
   *        return {
   *          autofocus: true
   *        }
   *      }
   *    }
   *
   */
  editorOptions(_element?: Element): Partial<EditorOptions> {
    return {};
  }

  /**
   * Finds the <input> element in the light dom and updates it with the value of `#serialize()`
   */
  updateInputElementValue() {
    if (this.inputElement != null && this.editor != null && !this.readonly) {
      this.inputElement.value = this.serialize();
    }
  }

  /**
   * Function called when grabbing the content of the editor. Currently supports JSON or HTML.
   */
  serialize() {
    if (this.editor == null) return "";

    if (this.serializer?.toLowerCase() === "json") {
      return JSON.stringify(this.editor.getJSON());
    }

    return this.editor.getHTML();
  }

  /**
   * Searches for the <input> element in the light dom to write the HTML or JSON to.
   */
  get inputElement(): Maybe<HTMLInputElement> {
    if (!this.input) return undefined;

    const rootNode = (this.getRootNode() || document) as Element;

    return rootNode.querySelector(`#${this.input}`) as Maybe<HTMLInputElement>;
  }

  async handleFiles(files: File[] | FileList): Promise<AttachmentManager[]> {
    if (this.editor == null) return [];
    if (files == null) return [];

    return new Promise((resolve, _reject) => {
      const fileAcceptEvents = [...files].map((file) => {
        const event = new FileAcceptEvent(file);
        this.dispatchEvent(event);
        return event;
      });

      const allowedFiles: File[] = [];

      for (let i = 0; i < fileAcceptEvents.length; i++) {
        const event = fileAcceptEvents[i];
        if (event.defaultPrevented) {
          continue;
        }
        allowedFiles.push(event.file);
      }

      const attachments = this.transformFilesToAttachments(allowedFiles);

      if (attachments == null || attachments.length <= 0) return;

      attachments.forEach((attachment) => {
        this.dispatchEvent(new AddAttachmentEvent(attachment));
      });

      // Need to reset the input otherwise you get this fun state where you can't
      //   insert the same file multiple times.
      resolve(attachments);
    });
  }

  handleDropFile = (
    _view: EditorView,
    event: DragEvent,
    _slice: Slice,
    moved: boolean,
  ) => {
    if (!(event instanceof DragEvent)) return false;
    if (moved) return false;

    return this.handleNativeDrop(event);
  };

  /**
   * Handles dropped files on the component, but not on the prosemirror instance.
   */
  handleNativeDrop(event: DragEvent): boolean {
    if (this.editor == null) return false;
    if (event == null) return false;
    //
    const { dataTransfer } = event;
    if (dataTransfer == null) return false;
    if (dataTransfer.files.length <= 0) return false;

    // This prevents this from firing twice because we both attach here and on the prosemirror instance
    if (event.defaultPrevented) return false;

    event.preventDefault();

    this.handleFiles(dataTransfer.files).then((attachments) => {
      this.editor
        ?.chain()
        .focus()
        .setAttachmentAtCoords(attachments, {
          top: event.clientY,
          left: event.clientX,
        })
        .run();
    });

    return true;
  }

  handlePaste = async (event: RhinoPasteEvent) => {
    if (this.editor == null) return;
    if (event == null) return;
    if (!(event instanceof ClipboardEvent)) return;

    const { clipboardData } = event;
    if (clipboardData == null) return;

    const hasFiles = clipboardData.files?.length > 0;
    if (!hasFiles) return;

    event.preventDefault();

    // This inserts the file name, this is consistent with Trix, but can feel weird.
    this.editor.commands.insertContent(clipboardData.items);
    const attachments = await this.handleFiles(clipboardData.files);

    if (attachments.length > 0) {
      this.editor?.chain().focus().setAttachment(attachments).run();
    }
  };

  transformFilesToAttachments(files?: File[] | FileList | null) {
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
        this.editor.view,
      );

      attachments.push(attachment);
    }

    return attachments;
  }

  renderToolbar() {
    return html``;
  }

  renderDialog() {}

  render(): TemplateResult {
    return html`
      ${this.renderToolbar()}
      <div class="editor-wrapper" part="editor-wrapper">
        ${this.renderDialog()}
        <div class="editor" part="editor">
          <slot name="editor">
            <div class="trix-content"></div>
          </slot>
        </div>
      </div>
    `;
  }

  allOptions(element: Element) {
    return Object.assign(
      this.__defaultOptions(element),
      this.editorOptions(element),
    );
  }

  /**
   * Due to some inconsistencies in how Trix will render the inputElement based on if its
   * the HTML representation, or transfromed with `#to_trix_html` this gives
   * us a consistent DOM structure to parse for rich text comments.
   */
  private normalizeDOM(
    inputElement: Maybe<HTMLInputElement>,
    parser = new DOMParser(),
  ) {
    if (inputElement == null || inputElement.value == null) return;

    const doc = parser.parseFromString(inputElement.value, "text/html");
    const figures = [...doc.querySelectorAll("figure[data-trix-attachment]")];
    const filtersWithoutChildren = figures.filter(
      (figure) => figure.querySelector("figcaption") == null,
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
          `<figcaption class="attachment__caption">${caption}</figcaption>`,
        );
        return;
      }
    });

    doc
      .querySelectorAll(
        "figure :not(.attachment__caption--edited) .attachment__name",
      )
      .forEach((el) => {
        if (el.textContent?.includes(" · ") === false) return;

        el.insertAdjacentText("beforeend", " · ");
      });

    const body = doc.querySelector("body");

    if (body) {
      inputElement.value = body.innerHTML;
    }
  }

  /**
   * @private
   * Use a getter here so when we rebuild the editor it pulls the latest starterKitOptions
   * This is intentionally not to be configured by a user. It makes updating extensions hard.
   *  it also is a getter and not a variable so that it will rerun in case options change.
   */
  private get __starterKitExtensions__(): EditorOptions["extensions"] {
    return [
      StarterKit.configure(this.starterKitOptions),
      RhinoStarterKit.configure(this.starterKitOptions),
    ];
  }

  /**
   * @param {Element} element - The element that the editor will be installed onto.
   */
  private __defaultOptions(element: Element): Partial<EditorOptions> {
    let content: Content = this.inputElement?.value || "";

    if (content) {
      try {
        content = JSON.parse(content);
      } catch (e) {}
    }

    return {
      injectCSS: false,
      extensions: this.__starterKitExtensions__.concat(this.extensions),
      autofocus: false,
      element,
      content,
      editable: !this.readonly,
      editorProps: {
        handleDrop: this.handleDropFile,
      },
    };
  }

  private __handleCreate: EditorOptions["onCreate"] = () => {
    this.requestUpdate();
  };

  private __handleUpdate: EditorOptions["onUpdate"] = () => {
    this.requestUpdate();

    if (!this.hasInitialized) {
      return;
    }

    // We dont want to update until we've fully initialized to give time for user extensions to kick in.
    this.updateInputElementValue();
    this.dispatchEvent(new RhinoChangeEvent());
  };

  private __handleFocus: EditorOptions["onFocus"] = () => {
    this.dispatchEvent(new RhinoFocusEvent());
    this.requestUpdate();
  };

  private __handleBlur: EditorOptions["onBlur"] = () => {
    this.updateInputElementValue();
    this.requestUpdate();
    this.dispatchEvent(new RhinoBlurEvent());
  };

  private __handleSelectionUpdate: EditorOptions["onSelectionUpdate"] = ({
    transaction,
  }) => {
    this.requestUpdate();
    this.dispatchEvent(new SelectionChangeEvent({ transaction }));
  };

  private __handleTransaction: EditorOptions["onTransaction"] = () => {
    this.requestUpdate();
  };

  private __bindEditorListeners(): void {
    if (this.editor == null) return;

    this.editor.on("focus", this.__handleFocus);
    this.editor.on("create", this.__handleCreate);
    this.editor.on("update", this.__handleUpdate);
    this.editor.on("selectionUpdate", this.__handleSelectionUpdate);
    this.editor.on("transaction", this.__handleTransaction);
    this.editor.on("blur", this.__handleBlur);
  }

  private __unBindEditorListeners(): void {
    if (this.editor == null) return;

    this.editor.off("focus", this.__handleFocus);
    this.editor.off("create", this.__handleCreate);
    this.editor.off("update", this.__handleUpdate);
    this.editor.off("selectionUpdate", this.__handleSelectionUpdate);
    this.editor.off("transaction", this.__handleTransaction);
    this.editor.off("blur", this.__handleBlur);
  }

  private __setupEditor(element: Element = this): Editor {
    if (!this.serializer || this.serializer === "html") {
      // This is a super hacky way to get __to_trix_html to support figcaptions without patching it.
      this.normalizeDOM(this.inputElement);
    }

    const editor = new Editor(this.allOptions(element));

    return editor;
  }
}
