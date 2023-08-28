import { BaseEvent } from "./base-event.js";

/**
 * Fires any time the editor changes
 */
export class RhinoChangeEvent extends BaseEvent {
  static eventName = "rhino-change" as const;

  constructor(options?: EventInit | undefined) {
    super(RhinoChangeEvent.eventName, options);
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [RhinoChangeEvent.eventName]: RhinoChangeEvent;
  }
}
