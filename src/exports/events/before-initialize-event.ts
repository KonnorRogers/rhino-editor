import { BaseEvent } from "./base-event.js";

/**
 * Fires before the editor has been created
 */
export class BeforeInitializeEvent extends BaseEvent {
  static eventName = "rhino-before-initialize" as const;

  constructor(options?: EventInit | undefined) {
    super(BeforeInitializeEvent.eventName, options);
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [BeforeInitializeEvent.eventName]: BeforeInitializeEvent;
  }
}
