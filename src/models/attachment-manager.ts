import { AttachmentAttributes, Maybe } from "src/types";
import { uuidv4 } from "src/models/uuidv4";
import { EditorView } from "prosemirror-view";
import { toDefaultCaption } from "src/views/to-default-caption";

/**
 * An attachment manager that matches the interface of Trix's attachment manager.
 *   This is what gets built on "tip-tap-attachment-add"
 */
export class AttachmentManager implements AttachmentAttributes {
  attributes: AttachmentAttributes & { attachmentId: string; imageId: string };
  editorView: EditorView;

  constructor(obj: AttachmentAttributes, editorView: EditorView) {
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

  setAttributes(obj: Omit<AttachmentAttributes, "src" | "file">) {
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
    	return
    }

    this.setNodeMarkup({
      sgid: this.attributes.sgid,
      content: this.attributes.content
    })
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

  get attachmentId(): string {
    return this.attributes.attachmentId;
  }

  get imageId(): string {
    return this.attributes.imageId;
  }

  get src(): string {
    return this.attributes.src;
  }

  set src(val: string) {
    this.attributes.src = val;
  }

  get sgid() {
  	return this.attributes.sgid
  }

  get file(): File {
    return this.attributes.file;
  }

  get contentType(): Maybe<string> {
    return this.file?.type;
  }

  get fileName(): Maybe<string> {
    return this.file?.name;
  }

  get fileSize(): Maybe<number> {
    return this.file?.size;
  }

  get content(): Maybe<string> {
  	return this.attributes.content
  }

  set content (val: Maybe<string>) {
  	this.attributes.content = val
  }

  get caption(): string {
  	return toDefaultCaption({ fileName: this.fileName, fileSize: this.fileSize })
  }
}
