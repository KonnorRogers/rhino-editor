import {DirectUpload} from "@rails/activestorage/src/direct_upload"
import { FileAttachment, TipTapAddAttachmentEvent } from "./tip-tap-element/element"
export interface AttachmentAttributes { attachable_sgid: string, signed_id: string, filename: string }

export class AttachmentUpload {
  directUpload: DirectUpload
  attachment: FileAttachment
  element: HTMLElement

  constructor(attachment: FileAttachment, element: HTMLElement) {
    this.attachment = attachment
    this.element = element
    this.directUpload = new DirectUpload(attachment.file, this.directUploadUrl, this)
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

  directUploadDidComplete(error: string, attributes: AttachmentAttributes) {
    if (error) {
      throw new Error(`Direct upload failed: ${error}`)
    }

    this.attachment.setAttributes({
      sgid: attributes.attachable_sgid,
      url: this.createBlobUrl(attributes.signed_id, attributes.filename)
    })
  }

  createBlobUrl(signedId: string, filename: string) {
    if (this.blobUrlTemplate == null) return ""

    return this.blobUrlTemplate
      .replace(":signed_id", signedId)
      .replace(":filename", encodeURIComponent(filename))
  }

  get directUploadUrl() {
    return this.element.dataset.directUploadUrl
  }

  get blobUrlTemplate() {
    return this.element.dataset.blobUrlTemplate
  }
}

declare global {
  interface WindowEventMap {
    [TipTapAddAttachmentEvent.eventName]: TipTapAddAttachmentEvent
  }
}

addEventListener(TipTapAddAttachmentEvent.eventName, (event: TipTapAddAttachmentEvent) => {
  const { attachment, target } = event

  if (target instanceof HTMLElement && attachment.file) {
    const upload = new AttachmentUpload(attachment, target)
    upload.start()
  }
})
