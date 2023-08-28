import { BaseEvent } from "./base-event.js";

/**
 * Fires any time a user pastes into the editor
 */
export class RhinoFocusEvent extends BaseEvent {
  static eventName = "rhino-focus" as const;

  constructor(options?: EventInit | undefined) {
    super(RhinoFocusEvent.eventName, options);
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [RhinoFocusEvent.eventName]: RhinoFocusEvent;
  }
}
