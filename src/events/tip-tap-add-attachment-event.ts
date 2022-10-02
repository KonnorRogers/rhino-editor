import { AttachmentManager } from "src/models/attachment-manager";

/**
 * A mapping of the "trix-add-attachment" for tip-tap that follows the same construct.
 */
export class TipTapAddAttachmentEvent extends Event {
  attachment: AttachmentManager;

  static get eventName(): "tip-tap-add-attachment" {
    return "tip-tap-add-attachment";
  }

  constructor(attachment: AttachmentManager, options: Partial<EventInit> = {}) {
    if (options.bubbles == null) options.bubbles = true;
    if (options.composed == null) options.composed = true;
    if (options.cancelable == null) options.cancelable = true;

    super(TipTapAddAttachmentEvent.eventName, options);
    this.attachment = attachment;
  }
}

/**
 * Tell typescript this is an "offical" event and what params to expect on
 * document.addEventListener() / window.addEventListener()
 */
declare global {
  interface WindowEventMap {
    [TipTapAddAttachmentEvent.eventName]: TipTapAddAttachmentEvent;
  }

  interface DocumentEventMap {
    [TipTapAddAttachmentEvent.eventName]: TipTapAddAttachmentEvent;
  }
}
