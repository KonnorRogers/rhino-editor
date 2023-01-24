import { AttachmentManager } from "src/exports/attachment-manager";

/**
 * A mapping of the "trix-add-attachment" for rhino that follows the same construct.
 */
export class AddAttachmentEvent extends Event {
  attachment: AttachmentManager;

  static get eventName(): "rhino-add-attachment" {
    return "rhino-add-attachment";
  }

  constructor(attachment: AttachmentManager, options: Partial<EventInit> = {}) {
    if (options.bubbles == null) options.bubbles = true;
    if (options.composed == null) options.composed = true;
    if (options.cancelable == null) options.cancelable = true;

    super(AddAttachmentEvent.eventName, options);
    this.attachment = attachment;
  }
}

/**
 * Tell typescript this is an "offical" event and what params to expect on
 * document.addEventListener() / window.addEventListener()
 */
declare global {
  // interface WindowEventMap {
  //   [AddAttachmentEvent.eventName]: AddAttachmentEvent;
  // }
  //
  // interface DocumentEventMap {
  //   [AddAttachmentEvent.eventName]: AddAttachmentEvent;
  // }
  //
  interface HTMLElementEventMap {
    [AddAttachmentEvent.eventName]: AddAttachmentEvent;
  }
}
