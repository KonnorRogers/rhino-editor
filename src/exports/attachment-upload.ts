import { DirectUpload } from "@rails/activestorage";
import type { Blob, DirectUploadDelegate } from "@rails/activestorage";
import { AttachmentManager } from "./attachment-manager.js";
import { LOADING_STATES } from "./elements/attachment-editor.js";

import { BaseEvent } from "./events/base-event.js";


class DirectUploadStartEvent<T extends DirectUpload = DirectUpload> extends BaseEvent {
  static eventName = "rhino-direct-upload:start" as const;

  constructor(public directUploadInstance: T, options?: EventInit | undefined) {
    super(DirectUploadStartEvent.name, options)
    this.directUploadInstance = directUploadInstance
  }
}

export class DirectUploadProgressEvent<T extends DirectUpload = DirectUpload> extends BaseEvent {
  static eventName = "rhino-direct-upload:progress" as const;

  constructor(public directUploadInstance: T, options?: EventInit | undefined) {
    super(DirectUploadProgressEvent.name, options)
    this.directUploadInstance = directUploadInstance
  }
}

export class DirectUploadErrorEvent<T extends DirectUpload = DirectUpload> extends BaseEvent {
  static eventName = "rhino-direct-upload:error" as const;

  constructor(public directUploadInstance: T, options?: EventInit | undefined) {
    super(DirectUploadErrorEvent.name, options)
    this.directUploadInstance = directUploadInstance
  }
}

export class DirectUploadSucceedEvent<T extends DirectUpload = DirectUpload> extends BaseEvent {
  static eventName = "rhino-direct-upload:succeed" as const;

  constructor(public directUploadInstance: T, options?: EventInit | undefined) {
    super(DirectUploadSucceedEvent.name, options)
    this.directUploadInstance = directUploadInstance
  }
}
export class DirectUploadCompleteEvent<T extends DirectUpload = DirectUpload> extends BaseEvent {
  static eventName = "rhino-direct-upload:complete" as const;

  constructor(public directUploadInstance: T, options?: EventInit | undefined) {
    super(DirectUploadCompleteEvent.name, options)
    this.directUploadInstance = directUploadInstance
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [DirectUploadStartEvent.eventName]: DirectUploadStartEvent;
    [DirectUploadProgressEvent.eventName]: DirectUploadProgressEvent;
    [DirectUploadErrorEvent.eventName]: DirectUploadErrorEvent;
    [DirectUploadSucceedEvent.eventName]: DirectUploadSucceedEvent;
    [DirectUploadCompleteEvent.eventName]: DirectUploadCompleteEvent;
  }
}

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

    if (this.attachment.file == null) throw "No file found for direct upload";

    this.directUpload = new DirectUpload(
      this.attachment.file,
      this.directUploadUrl,
      this,
    );
  }

  start() {
    this.directUpload.create(this.directUploadDidComplete.bind(this));
    this.element.dispatchEvent(new DirectUploadStartEvent(this.directUpload))
  }

  directUploadWillStoreFileWithXHR(xhr: XMLHttpRequest) {
    xhr.upload.addEventListener("progress", (event) => {
      const progress = (event.loaded / event.total) * 100;
      this.currentProgress = progress;
      this.setUploadProgress();
      this.element.dispatchEvent(new DirectUploadProgressEvent(this.directUpload))
    });
  }

  directUploadDidComplete(
    error: Error,
    blob: Blob & { attachable_sgid?: string },
  ) {
    if (error) {
      this.currentProgress = 0;
      if (this.attachment.content == null) {
        this.attachment.setNodeMarkup({
          progress: 0,
          loadingState: LOADING_STATES.error,
        });
      }

      this.element.dispatchEvent(new DirectUploadErrorEvent(this.directUpload))
      this.element.dispatchEvent(new DirectUploadCompleteEvent(this.directUpload))
      throw Error(`Direct upload failed: ${error}`);
    }

    this.attachment.setAttributes({
      sgid: blob.attachable_sgid ?? "",
      url: this.createBlobUrl(blob.signed_id, blob.filename),
    });

    this.currentProgress = 100;
    this.setUploadProgress();

    this.element.dispatchEvent(new DirectUploadSucceedEvent(this.directUpload))
    this.element.dispatchEvent(new DirectUploadCompleteEvent(this.directUpload))
  }

  setUploadProgress() {
    if (this.currentProgress >= 100) {
      this.currentProgress = 100;
      this.attachment.setUploadProgress(100);
      return;
    }

    this.attachment.setUploadProgress(this.currentProgress);
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
        `No "data-direct-upload-url" attribute is set on ${this.element}`,
      );
    }
    return this.element.dataset.directUploadUrl;
  }

  get blobUrlTemplate() {
    return this.element.dataset.blobUrlTemplate;
  }
}
