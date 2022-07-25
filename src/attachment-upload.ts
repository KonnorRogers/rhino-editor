import {DirectUpload} from "@rails/activestorage"
import type { Blob, DirectUploadDelegate } from "@rails/activestorage"
import { toMemorySize } from "./tip-tap-element/toMemorySize"
import { Maybe } from "./tip-tap-element/types"
import { uuidv4 } from "./uuidv4"
import type { AttachmentEditor } from "./tip-tap-element/attachment-editor"

export type AttachmentAttributes = {
  file: File
  src: string
  sgid?: Maybe<string>
  url?: Maybe<string>
}


export class AttachmentManager implements AttachmentAttributes {
  attributes: AttachmentAttributes & { attachmentId: string, imageId: string }
  editor: HTMLElement

  constructor (obj: AttachmentAttributes, editor: HTMLElement) {
    this.editor = editor
    this.attributes = {
      attachmentId: uuidv4(),
      imageId: uuidv4(),
      sgid: null,
      url: null,
      ...obj
    }
  }

  setUploadProgress (progress: number): void {
    const attachmentEditor = this.attachmentEditor
    if (attachmentEditor) {
      attachmentEditor.progress = progress
    }
  }

  get attachmentEditor (): Maybe<AttachmentEditor> {
    return (this.editor.shadowRoot?.querySelector(`[data-attachment-id="${this.attachmentId}"]`) as Maybe<AttachmentEditor>)
  }

  setAttributes (obj: Record<"sgid" | "url", string>) {
    const image = this.editor.shadowRoot?.querySelector(`[data-image-id="${this.imageId}"]`) as Maybe<HTMLMediaElement>

    if (image == null) return

    this.attributes.sgid = obj.sgid
    this.attributes.url = obj.url

    image.src = obj.url

    // @ts-expect-error
    image.sgid = obj.sgid
  }

  get attachmentId (): string {
    return this.attributes.attachmentId
  }

  get imageId (): string {
    return this.attributes.imageId
  }

  get src (): string {
    return this.attributes.src
  }

  set src (val: string) {
    this.attributes.src = val
  }

  get file (): File {
    return this.attributes.file
  }

  get contentType (): string {
    return this.file.type
  }

  get fileName (): string {
    return this.file.name
  }

  get fileSize (): number {
    return this.file.size
  }

  get caption (): string {
    return `${this.fileName} ${toMemorySize(this.fileSize)}`
  }
}

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
