import { AttachmentManager } from "../attachment-manager.js";
import { BaseEvent } from "./base-event.js";

/**
 * A mapping of the "trix-attachment-add" for Rhino that follows the same construct.
 *   Fires after an attachment has been added.
 */
export class AddAttachmentEvent extends BaseEvent {
  static eventName = "rhino-attachment-add" as const;

  constructor(
    public attachment: AttachmentManager,
    options: Partial<EventInit> = {},
  ) {
    super(AddAttachmentEvent.eventName, options);
    this.attachment = attachment;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [AddAttachmentEvent.eventName]: AddAttachmentEvent;
  }
}
