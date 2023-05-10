import { BaseEvent } from "./base-event";

/**
 * A mapping of the "trix-attachment-add" for rhino that follows the same construct.
 */
export class FileAcceptEvent extends BaseEvent {
  static get eventName(): "rhino-file-accept" {
    return "rhino-file-accept";
  }

  constructor(
    public file: File,
    options?: EventInit | undefined)
  {
    super(FileAcceptEvent.eventName, options);
    this.file = file
  }
}

/**
 * Tell typescript this is an "offical" event and what params to expect on
 * document.addEventListener() / window.addEventListener()
 */
declare global {
  interface HTMLElementEventMap {
    [FileAcceptEvent.eventName]: FileAcceptEvent;
  }
}
