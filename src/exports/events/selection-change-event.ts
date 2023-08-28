import { Transaction } from "@tiptap/pm/state";
import { BaseEvent } from "./base-event.js";

export interface SelectionChangeProps {
  transaction: Transaction;
}

/**
 * Fires before the editor has been created
 */
export class SelectionChangeEvent extends BaseEvent {
  static eventName = "rhino-selection-change" as const;

  transaction: Transaction;

  constructor(
    { transaction }: SelectionChangeProps,
    options?: EventInit | undefined,
  ) {
    super(SelectionChangeEvent.eventName, options);
    this.transaction = transaction;
  }
}

declare global {
  interface GlobalEventHandlersEventMap {
    [SelectionChangeEvent.eventName]: SelectionChangeEvent;
  }
}
