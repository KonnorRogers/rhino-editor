import { BaseEvent } from "./base-event.js";

/**
 * Fires any time a user pastes into the editor
 */
export class RhinoPasteEvent extends BaseEvent implements ClipboardEvent {
  static eventName = "rhino-paste" as const;

  constructor(
    public clipboardData: DataTransfer | null,
    public originalPasteEvent: Event,
    options?: EventInit | undefined,
  ) {
    super(RhinoPasteEvent.eventName, options);
    this.clipboardData = clipboardData;
    this.originalPasteEvent = originalPasteEvent;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [RhinoPasteEvent.eventName]: RhinoPasteEvent;
  }
}
