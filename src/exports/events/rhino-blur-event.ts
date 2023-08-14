import { BaseEvent } from "./base-event.js";

/**
 * Fires any time a user pastes into the editor
 */
export class RhinoBlurEvent extends BaseEvent {
  static eventName = "rhino-blur" as const;

  constructor(options?: EventInit | undefined) {
    super(RhinoBlurEvent.eventName, options);
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [RhinoBlurEvent.eventName]: RhinoBlurEvent;
  }
}
