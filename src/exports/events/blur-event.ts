import { BaseEvent } from "./base-event";

/**
 * Fires any time a user pastes into the editor
 */
export class BlurEvent extends BaseEvent {
  static eventName = "rhino-blur" as const

  constructor(options?: EventInit | undefined) {
    super(BlurEvent.eventName, options);
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [BlurEvent.eventName]: BlurEvent;
  }
}
