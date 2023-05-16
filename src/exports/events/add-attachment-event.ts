import { AttachmentManager } from "src/exports/attachment-manager";
import { BaseEvent } from "./base-event";

/**
 * A mapping of the "trix-attachment-add" for rhino that follows the same construct.
 */
export class AddAttachmentEvent extends BaseEvent {
  attachment: AttachmentManager;

  static get eventName(): "rhino-attachment-add" {
    return "rhino-attachment-add";
  }

  constructor(attachment: AttachmentManager, options: Partial<EventInit> = {}) {
    super(AddAttachmentEvent.eventName, options);
    this.attachment = attachment;
  }
}

/**
 * Tell typescript this is an "offical" event and what params to expect on
 * document.addEventListener() / window.addEventListener()
 */
declare global {
  interface HTMLElementEventMap {
    [AddAttachmentEvent.eventName]: AddAttachmentEvent;
  }
}
