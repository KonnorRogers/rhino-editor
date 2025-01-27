import { LitElement } from "lit";

export class BaseElement extends LitElement {
  static customElementRegistry = window.customElements;
  static baseName: string;
  static define(
    name?: string,
    ctor?: CustomElementConstructor,
    options?: ElementDefinitionOptions,
  ) {
    if (name == null) name = this.baseName;
    if (ctor == null) ctor = this;

    // Can't register twice.
    if (this.customElementRegistry.get(name)) return;

    // creates anonymous class due to a limitation of CEs only allowing 1 class definition.
    this.customElementRegistry.define(name, toAnonymousClass(ctor), options);
  }

  internals?: ElementInternals;

  constructor() {
    super();

    try {
      this.internals = this.attachInternals();
    } catch (e) {
      console.error(e);
    }
  }

  addCustomState(state: string) {
    try {
      this.internals?.states.add(state);
    } catch (_e) {
      // probably not supported, not a big deal.
    }
  }

  deleteCustomState(state: string) {
    try {
      this.internals?.states.delete(state);
    } catch (_e) {
      // probably not supported, not a big deal.
    }
  }

  hasCustomState(state: string) {
    try {
      return this.internals?.states.has(state);
    } catch (_e) {
      // Probably not supported. Just return false.
      return false;
    }
  }

  toggleCustomState(state: string, force?: boolean) {
    if (force == null) {
      if (this.hasCustomState(state)) {
        this.deleteCustomState(state);
      } else {
        this.addCustomState(state);
      }
      return;
    }

    force === true ? this.addCustomState(state) : this.deleteCustomState(state);
  }
}

export type Constructor = new (...args: any[]) => {};

export function toAnonymousClass<T extends Constructor>(klass: T): T {
  return class extends klass {};
}
