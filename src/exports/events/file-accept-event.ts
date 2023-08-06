import { BaseEvent } from "./base-event";

/**
 * A mapping of the "trix-attachment-add" for rhino that follows the same construct.
 *   Use this to prevent uploading a file by calling `event.preventDefault()`
 */
export class FileAcceptEvent extends BaseEvent {
  static eventName = "rhino-file-accept" as const;

  constructor(
    public file: File,
    options?: EventInit | undefined,
  ) {
    super(FileAcceptEvent.eventName, options);
    this.file = file;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [FileAcceptEvent.eventName]: FileAcceptEvent;
  }
}
