import { DirectUpload } from "@rails/activestorage"
import type { Blob, DirectUploadDelegate } from "@rails/activestorage"
import { AttachmentManager } from 'src/models/attachment-manager'

/**
 * An extension of DirectUpload. This is what handles uploading to remote sources
 *   for attachments.
 */
export class AttachmentUpload implements DirectUploadDelegate {
  directUpload: DirectUpload
  attachment: AttachmentManager
  element: HTMLElement

  constructor(attachment: AttachmentManager, element: HTMLElement) {
    this.attachment = attachment
    this.element = element
    this.directUpload = new DirectUpload(this.attachment.file, this.directUploadUrl, this)
  }

  start() {
    this.directUpload.create(this.directUploadDidComplete.bind(this))
  }

  directUploadWillStoreFileWithXHR(xhr: XMLHttpRequest) {
    xhr.upload.addEventListener("progress", event => {
      const progress = event.loaded / event.total * 100
      this.attachment.setUploadProgress(progress)
    })
  }

  directUploadDidComplete(error: Error, blob: Blob & { attachable_sgid?: string }) {
    if (error) {
      throw new Error(`Direct upload failed: ${error}`)
    }

    this.attachment.setAttributes({
      sgid: blob.attachable_sgid ?? "",
      url: this.createBlobUrl(blob.signed_id, blob.filename)
    })

    // Need to wait until next event loop because of some weirdness with progress.
    setTimeout(() => this.attachment.setUploadProgress(100));
  }

  createBlobUrl(signedId: string, filename: string) {
    if (this.blobUrlTemplate == null) return ""

    return this.blobUrlTemplate
      .replace(":signed_id", signedId)
      .replace(":filename", encodeURIComponent(filename))
  }

  get directUploadUrl() {
    if (this.element.dataset.directUploadUrl == null) {
      throw Error(`No "data-direct-upload-url" attribute is set on ${this.element}`)
    }
    return this.element.dataset.directUploadUrl
  }

  get blobUrlTemplate() {
    return this.element.dataset.blobUrlTemplate
  }
}
