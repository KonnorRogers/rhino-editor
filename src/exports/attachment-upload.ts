import { DirectUpload } from "@rails/activestorage";
import type { Blob, DirectUploadDelegate } from "@rails/activestorage";
import { AttachmentManager } from "./attachment-manager.js";
import { LOADING_STATES } from "./elements/attachment-editor.js";

import { BaseEvent } from "./events/base-event.js";

export class AttachmentUploadStartEvent<
  T extends AttachmentUpload = AttachmentUpload,
> extends BaseEvent {
  static eventName = "rhino-direct-upload:start" as const;

  constructor(
    public attachmentUpload: T,
    options?: EventInit | undefined,
  ) {
    super(AttachmentUploadStartEvent.eventName, options);
    this.attachmentUpload = attachmentUpload;
  }
}

export class AttachmentUploadProgressEvent<
  T extends AttachmentUpload = AttachmentUpload,
> extends BaseEvent {
  static eventName = "rhino-direct-upload:progress" as const;

  constructor(
    public attachmentUpload: T,
    options?: EventInit | undefined,
  ) {
    super(AttachmentUploadProgressEvent.eventName, options);
    this.attachmentUpload = attachmentUpload;
  }
}

export class AttachmentUploadErrorEvent<
  T extends AttachmentUpload = AttachmentUpload,
> extends BaseEvent {
  static eventName = "rhino-direct-upload:error" as const;

  constructor(
    public attachmentUpload: T,
    options?: EventInit | undefined,
  ) {
    super(AttachmentUploadErrorEvent.eventName, options);
    this.attachmentUpload = attachmentUpload;
  }
}

export class AttachmentUploadSucceedEvent<
  T extends AttachmentUpload = AttachmentUpload,
> extends BaseEvent {
  static eventName = "rhino-direct-upload:succeed" as const;

  constructor(
    public attachmentUpload: T,
    options?: EventInit | undefined,
  ) {
    super(AttachmentUploadSucceedEvent.eventName, options);
    this.attachmentUpload = attachmentUpload;
  }
}
export class AttachmentUploadCompleteEvent<
  T extends AttachmentUpload = AttachmentUpload,
> extends BaseEvent {
  static eventName = "rhino-direct-upload:complete" as const;

  constructor(
    public attachmentUpload: T,
    options?: EventInit | undefined,
  ) {
    super(AttachmentUploadCompleteEvent.eventName, options);
    this.attachmentUpload = attachmentUpload;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [AttachmentUploadStartEvent.eventName]: AttachmentUploadStartEvent;
    [AttachmentUploadProgressEvent.eventName]: AttachmentUploadProgressEvent;
    [AttachmentUploadErrorEvent.eventName]: AttachmentUploadErrorEvent;
    [AttachmentUploadSucceedEvent.eventName]: AttachmentUploadSucceedEvent;
    [AttachmentUploadCompleteEvent.eventName]: AttachmentUploadCompleteEvent;
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
  progress = 0;

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
    this.element.dispatchEvent(new AttachmentUploadStartEvent(this));
  }

  directUploadWillStoreFileWithXHR(xhr: XMLHttpRequest) {
    const maxPossibleProgress = 90;
    xhr.upload.addEventListener("progress", (event) => {
      // Cap upload progress to 90%. The last 10% needs to be filled by a successful load.
      const progress = Math.min(
        (event.loaded / event.total) * 100,
        maxPossibleProgress,
      );
      this.progress = progress;
      this.setUploadProgress();
      this.element.dispatchEvent(new AttachmentUploadProgressEvent(this));
    });
  }

  handleError(error?: Error) {
    this.progress = 0;
    if (this.attachment.content == null) {
      this.attachment.setNodeMarkup({
        progress: 0,
        loadingState: LOADING_STATES.error,
      });
    }

    this.element.dispatchEvent(new AttachmentUploadErrorEvent(this));
    this.element.dispatchEvent(new AttachmentUploadCompleteEvent(this));

    if (error) {
      throw Error(`Direct upload failed: ${error}`);
    }
  }

  directUploadDidComplete(
    error: Error,
    blob: Blob & { attachable_sgid?: string },
  ) {
    if (error) {
      this.handleError(error);
      return;
    }

    if (blob.attachable_sgid) {
      const blobUrl = this.createBlobUrl(blob.signed_id, blob.filename);
      this.attachment.directUpload = this;
      this.attachment.setAttributes({
        sgid: blob.attachable_sgid,
        url: blobUrl,
      });
    }
  }

  setUploadProgress() {
    if (this.progress >= 100) {
      this.progress = 100;
      this.attachment.setUploadProgress(100);
      return;
    }

    this.attachment.setUploadProgress(this.progress);
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
