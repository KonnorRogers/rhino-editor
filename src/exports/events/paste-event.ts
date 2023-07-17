import { BaseEvent } from "./base-event";

/**
 * Fires any time a user pastes into the editor
 */
export class PasteEvent extends BaseEvent {
  static eventName = "rhino-paste" as const

  constructor(options?: EventInit | undefined) {
    super(PasteEvent.eventName, options);
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [PasteEvent.eventName]: PasteEvent;
  }
}
