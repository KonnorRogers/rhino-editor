import { Maybe } from "../types.js";
import { uuidv4 } from "../internal/uuidv4.js";
import type { EditorView } from "@tiptap/pm/view";
import { LOADING_STATES } from "./elements/attachment-editor.js";
import { toDefaultCaption } from "../internal/to-default-caption.js";
import {
  AttachmentUpload,
  AttachmentUploadCompleteEvent,
  AttachmentUploadSucceedEvent,
} from "./attachment-upload.js";

export interface AttachmentManagerAttributes {
  src: string;

  file?: Maybe<File>;

  attachmentId?: Maybe<string>;
  imageId?: Maybe<string>;
  sgid?: Maybe<string>;
  contentType?: Maybe<string>;
  fileName?: Maybe<string>;
  fileSize?: Maybe<number>;
  content?: Maybe<string>;
  caption?: Maybe<string>;
  url?: Maybe<string>;
  width?: Maybe<number>;
  height?: Maybe<number>;
  previewable?: Maybe<boolean>;
}

/**
 * An attachment manager that matches the interface of Trix's attachment manager.
 *   This is what gets built on "rhino-attachment-add"
 */
export class AttachmentManager implements AttachmentManagerAttributes {
  attributes: AttachmentManagerAttributes;
  editorView: EditorView;
  directUpload?: AttachmentUpload;

  static get previewableRegex() {
    return /^image(\/(gif|png|jpe?g)|$)/;
  }

  static isPreviewable(str: string) {
    // (this || AttachmentManager) works around a strange bug in ESBuild v0.14.17 around how it transpiles static functions.
    return (this || AttachmentManager).previewableRegex.test(str);
  }

  constructor(obj: AttachmentManagerAttributes, editorView: EditorView) {
    this.editorView = editorView;
    this.attributes = {
      attachmentId: uuidv4(),
      content: null,
      imageId: uuidv4(),
      sgid: null,
      url: null,
      ...obj,
    };

    this.attributes.previewable = this.isPreviewable;
  }

  setUploadProgress(progress: number): void {
    if (this.content == null) {
      this.setNodeMarkup({
        progress,
        loadingState:
          progress >= 100 ? LOADING_STATES.success : LOADING_STATES.loading,
      });
    }
  }

  setAttributes(obj: Partial<AttachmentManagerAttributes>) {
    this.attributes = Object.assign(this.attributes, obj);

    /**
     * These are the old Trix custom attachment APIs.
     */
    if (obj.content) {
      this.setNodeMarkup({
        sgid: this.attributes.sgid,
        content: this.attributes.content,
        previewable: this.isPreviewable,
      });

      this.handleSuccess();

      return;
    }

    /**
     * Sometimes we don't have a URL. We need that.
     */
    if (!obj.url) {
      return;
    }
    if (this.isPreviewable) {
      /** This preloads the image so we don't show a big flash. */
      const image = new Image();

      image.setAttribute("src", obj.url);

      image.onload = () => {
        this.attributes.width = image.naturalWidth;
        this.attributes.height = image.naturalHeight;

        this.setNodeMarkup({
          sgid: this.attributes.sgid,
          url: this.attributes.url,
          src: this.attributes.url,
          href: this.attributes.url + "?content-disposition=attachment",
          width: this.attributes.width,
          height: this.attributes.height,
          contentType: this.contentType,
          previewable: this.isPreviewable,
        });
        image.remove();
        this.handleSuccess();
      };
      return;
    }

    /**
     * These are non-previewable assets like CSVs, Word docs, etc.
     */
    this.setNodeMarkup({
      sgid: this.attributes.sgid,
      url: this.attributes.url,
      contentType: this.contentType,
      previewable: this.isPreviewable,
    });
    this.handleSuccess();
  }

  handleSuccess() {
    this.setUploadProgress(100);
    const upload = this.directUpload;

    if (upload) {
      upload.element.dispatchEvent(new AttachmentUploadSucceedEvent(upload));
      upload.element.dispatchEvent(new AttachmentUploadCompleteEvent(upload));
    }
  }

  /**
   * Helper function to set the markup for an attachment. We map a uuid to the "attachmentId"
   * of the TipTap node to guarantee we're targeting the right one.
   */
  setNodeMarkup(obj: Record<string, unknown>) {
    const view = this.editorView;

    if (view == null) return;

    view.state.doc.descendants((descendantNode, position: number) => {
      if (descendantNode.attrs.attachmentId === this.attachmentId) {
        view.dispatch(
          view.state.tr.setNodeMarkup(position, undefined, {
            ...descendantNode.attrs,
            ...obj,
          }),
        );
      }
    });
  }

  /**
   * This is an internal ID used for finding newly attached attachments in the TipTap editor.
   * This is used primarily for direct upload purposes.
   * This generally won't exist when a node is recreated from you database.
   */
  get attachmentId() {
    return this.attributes.attachmentId;
  }

  /**
   * This is an internal ID used for finding newly attached images in the TipTap editor.
   * This is used primarily for direct upload purposes.
   * This generally won't exist when a node is recreated from you database.
   */
  get imageId() {
    return this.attributes.imageId;
  }

  /**
   * `src` (when present) always maps to a URL.createObjectURL.
   */
  get src() {
    return this.attributes.src;
  }

  set src(val: string) {
    this.attributes.src = val;
  }

  get sgid() {
    return this.attributes.sgid;
  }

  get file() {
    return this.attributes.file;
  }

  get contentType() {
    return this.attributes.contentType || this.file?.type;
  }

  get fileName() {
    return this.attributes.fileName || this.file?.name;
  }

  get fileSize() {
    return this.attributes.fileSize || this.file?.size;
  }

  /**
   * This field is populated by the old Trix custom attachment API and denotes if we're using a custom
   * attachment.
   */
  get content() {
    return this.attributes.content;
  }

  set content(val: Maybe<string>) {
    this.attributes.content = val;
  }

  get height() {
    return this.attributes.height;
  }

  get width() {
    return this.attributes.width;
  }

  get isPreviewable() {
    const isPreviewable = (
      this.constructor as unknown as typeof AttachmentManager
    ).isPreviewable;

    const contentType = this.contentType;

    return isPreviewable(contentType || "");
  }

  get caption() {
    const defaultCaption = toDefaultCaption({
      fileName: this.attributes.fileName,
      fileSize: this.attributes.fileSize,
    });
    // We want to set a real caption for non-previewable assets to prevent them from getting cleared out.
    if (this.isPreviewable) {
      return defaultCaption;
    }

    return this.attributes.caption || defaultCaption || "";
  }
}
