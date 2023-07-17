import { BaseEvent } from "./base-event";

/**
 * Fires any time the editor changes
 */
export class ChangeEvent extends BaseEvent {
  static eventName = "rhino-change" as const

  constructor(options?: EventInit | undefined) {
    super(ChangeEvent.eventName, options);
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [ChangeEvent.eventName]: ChangeEvent;
  }
}
