import { BaseEvent } from "./base-event.js";

/**
 * Fires any time LitElement calls the "updated" function. This is a good event for tracking changes to the editor as it includes both the host Web Component and the underlying TipTap instance.
 */
export class RhinoUpdateEvent extends BaseEvent {
  static eventName = "rhino-update" as const;

  constructor(options?: EventInit | undefined) {
    super(RhinoUpdateEvent.eventName, options);
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [RhinoUpdateEvent.eventName]: RhinoUpdateEvent;
  }
}
