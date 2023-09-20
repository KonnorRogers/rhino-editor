import { Maybe } from "../types.js";
import { uuidv4 } from "../internal/uuidv4.js";
import { EditorView } from "@tiptap/pm/view";
import { toDefaultCaption } from "../internal/to-default-caption.js";

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
}

/**
 * An attachment manager that matches the interface of Trix's attachment manager.
 *   This is what gets built on "rhino-attachment-add"
 */
export class AttachmentManager implements AttachmentManagerAttributes {
  attributes: AttachmentManagerAttributes;
  editorView: EditorView;

  static get previewableRegex () {
    return /^image(\/(gif|png|jpe?g)|$)/
  }

  static isPreviewable (str: string) {
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
  }

  setUploadProgress(progress: number): void {
    if (this.content == null) {
      this.setNodeMarkup({ progress });
    }
  }

  setAttributes(obj: AttachmentManagerAttributes) {
  console.log({
  attributes: this.attributes,
  obj
  })
    this.attributes = Object.assign(this.attributes, obj)

    /**
     * These are the old Trix custom attachment APIs.
     */
    if (obj.content) {
      this.setNodeMarkup({
        sgid: this.attributes.sgid,
        content: this.attributes.content,
      });

      return
    }

    /**
     * Sometimes we don't have a URL. We need that.
     */
    // if (!obj.url) {
    //   return
    // }

    const isPreviewable = (this.constructor as unknown as typeof AttachmentManager).isPreviewable

    const contentType = this.contentType

    if (contentType && isPreviewable(contentType)) {
      /** This preloads the image so we don't show a big flash. */
      const image = new Image();

      // @ts-expect-error
      image.src = obj.url;

      image.onload = () => {
        this.attributes.width = image.naturalWidth
        this.attributes.height = image.naturalHeight
        console.log({ naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight })

        this.setNodeMarkup({
          sgid: this.attributes.sgid,
          url: this.attributes.url,
          src: this.attributes.url,
          href: this.attributes.url + "?content-disposition=attachment",
          width: this.attributes.width,
          height: this.attributes.height,
          contentType: this.contentType,
        });
        image.remove();
      };
      return;
    }

    /**
     * These are non-previewable assets like CSVs, Word docs, etc.
     */
    this.setNodeMarkup({
      sgid: this.attributes.sgid,
      url: this.attributes.url,
      contentType: this.contentType
    });
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

  get attachmentId() {
    return this.attributes.attachmentId;
  }

  get imageId() {
    return this.attributes.imageId;
  }

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

  get content() {
    return this.attributes.content;
  }

  set content(val: Maybe<string>) {
    this.attributes.content = val;
  }

  get height () {
    return this.attributes.height
  }

  get width () {
    return this.attributes.width
  }

  get caption(): string {
    return toDefaultCaption({
      fileName: this.fileName,
      fileSize: this.fileSize,
    });
  }
}
