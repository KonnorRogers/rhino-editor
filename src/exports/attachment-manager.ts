import { Maybe } from "src/types";
import { uuidv4 } from "src/internal/uuidv4";
import { EditorView } from "@tiptap/pm/view";
import { toDefaultCaption } from "src/internal/to-default-caption";

export interface AttachmentManagerAttributes {
  src: string

  file?: Maybe<File>

  attachmentId?: Maybe<string>
  imageId?: Maybe<string>
  sgid?: Maybe<string>
  contentType?: Maybe<string>
  fileName?: Maybe<string>
  fileSize?: Maybe<number>
  content?: Maybe<string>
  caption?: Maybe<string>
  url?: Maybe<string>
}

/**
 * An attachment manager that matches the interface of Trix's attachment manager.
 *   This is what gets built on "rhino-attachment-add"
 */
export class AttachmentManager implements AttachmentManagerAttributes {
  attributes: AttachmentManagerAttributes;
  editorView: EditorView;

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

  setAttributes(obj: Omit<AttachmentManagerAttributes, "src" | "file">) {
    this.attributes.sgid = obj.sgid;

    if (obj.content == null && obj.url) {
      /** This preloads the image so we don't show a big flash. */
      const image = new Image();

      this.attributes.url = obj.url;

      image.src = obj.url;

      image.onload = () => {
        this.setNodeMarkup({
          sgid: this.attributes.sgid,
          url: this.attributes.url,
          src: this.attributes.url,
          href: this.attributes.url + "?content-disposition=attachment",
        });
        image.remove();
      };
      return;
    }

    this.setNodeMarkup({
      sgid: this.attributes.sgid,
      content: this.attributes.content,
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
          })
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

  get caption(): string {
    return toDefaultCaption({
      fileName: this.fileName,
      fileSize: this.fileSize,
    });
  }
}
