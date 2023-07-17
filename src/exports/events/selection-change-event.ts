import { BaseEvent } from "./base-event";

/**
 * Fires before the editor has been created
 */
export class SelectionChangeEvent extends BaseEvent {
  static eventName = "rhino-selection-change" as const

  constructor(options?: EventInit | undefined) {
    super(SelectionChangeEvent.eventName, options);
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [SelectionChangeEvent.eventName]: SelectionChangeEvent;
  }
}
