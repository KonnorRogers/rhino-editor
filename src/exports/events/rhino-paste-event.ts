import { BaseEvent } from "./base-event";

/**
 * Fires any time a user pastes into the editor
 */
export class RhinoPasteEvent extends BaseEvent {
  static eventName = "rhino-paste" as const

  constructor(options?: EventInit | undefined) {
    super(RhinoPasteEvent.eventName, options);
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [RhinoPasteEvent.eventName]: RhinoPasteEvent;
  }
}
