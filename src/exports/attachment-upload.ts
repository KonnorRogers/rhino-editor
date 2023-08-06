import { DirectUpload } from "@rails/activestorage";
import type { Blob, DirectUploadDelegate } from "@rails/activestorage";
import { AttachmentManager } from "src/exports/attachment-manager";

/**
 * An extension of DirectUpload. This is what handles uploading to remote sources
 *   for attachments.
 */
export class AttachmentUpload implements DirectUploadDelegate {
  directUpload: DirectUpload;
  attachment: AttachmentManager;
  element: HTMLElement;
  currentProgress = 0;

  constructor(attachment: AttachmentManager, element: HTMLElement) {
    this.attachment = attachment;
    this.element = element;

    if (this.attachment.file == null) throw "No file found for direct upload"

    this.directUpload = new DirectUpload(
      this.attachment.file,
      this.directUploadUrl,
      this
    );
  }

  start() {
    this.directUpload.create(this.directUploadDidComplete.bind(this));
  }

  directUploadWillStoreFileWithXHR(xhr: XMLHttpRequest) {
    xhr.upload.addEventListener("progress", (event) => {
      const progress = (event.loaded / event.total) * 100;
      this.currentProgress = progress;
      this.setUploadProgress();
    });
  }

  directUploadDidComplete(
    error: Error,
    blob: Blob & { attachable_sgid?: string }
  ) {
    if (error) {
      this.currentProgress = 0;
      if (this.attachment.content == null) {
        this.attachment.setNodeMarkup({
          progress: 0,
          loadingState: "error",
        });
      }

      throw Error(`Direct upload failed: ${error}`);
    }

    this.attachment.setAttributes({
      sgid: blob.attachable_sgid ?? "",
      url: this.createBlobUrl(blob.signed_id, blob.filename),
    });

    this.currentProgress = 100;
    this.setUploadProgress();
  }

  setUploadProgress() {
    if (this.currentProgress >= 100) {
      this.currentProgress = 100;
      this.attachment.setUploadProgress(100);
      return;
    }

    this.attachment.setUploadProgress(this.currentProgress);
    this.setUploadProgress();
  }

  createBlobUrl(signedId: string, filename: string) {
    if (this.blobUrlTemplate == null) return "";

    return this.blobUrlTemplate
      .replace(":signed_id", signedId)
      .replace(":filename", encodeURIComponent(filename));
  }

  get directUploadUrl() {
    if (this.element.dataset.directUploadUrl == null) {
      throw Error(
        `No "data-direct-upload-url" attribute is set on ${this.element}`
      );
    }
    return this.element.dataset.directUploadUrl;
  }

  get blobUrlTemplate() {
    return this.element.dataset.blobUrlTemplate;
  }
}
