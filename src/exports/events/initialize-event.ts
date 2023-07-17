import { BaseEvent } from "./base-event";

export class InitializeEvent extends BaseEvent {
  static eventName = "rhino-initialize" as const

  constructor(options?: EventInit | undefined) {
    super(InitializeEvent.eventName, options);
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [InitializeEvent.eventName]: InitializeEvent;
  }
}
