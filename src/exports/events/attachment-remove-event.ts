import { AttachmentManager } from "../attachment-manager.js";
import { BaseEvent } from "./base-event.js";

/**
 * A mapping of the "trix-attachment-add" for Rhino that follows the same construct.
 *   Fires after an attachment has been added.
 */
export class AttachmentRemoveEvent extends BaseEvent {
  static eventName = "rhino-attachment-remove" as const;

  constructor(
    public attachment: AttachmentManager,
    options: Partial<EventInit> = {},
  ) {
    super(AttachmentRemoveEvent.eventName, options);
    this.attachment = attachment;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [AttachmentRemoveEvent.eventName]: AttachmentRemoveEvent;
  }
}
