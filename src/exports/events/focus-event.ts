import { BaseEvent } from "./base-event";

/**
 * Fires any time a user pastes into the editor
 */
export class FocusEvent extends BaseEvent {
  static eventName = "rhino-focus" as const

  constructor(options?: EventInit | undefined) {
    super(FocusEvent.eventName, options);
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [FocusEvent.eventName]: FocusEvent;
  }
}
