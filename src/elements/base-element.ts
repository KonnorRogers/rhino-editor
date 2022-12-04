import { LitElement } from "lit"

export class BaseElement extends LitElement {
  static customElementRegistry = window.customElements
  static baseName: string
  static define (
    name?: string,
    ctor?: CustomElementConstructor,
    options?: ElementDefinitionOptions
  ) {
    if (name == null) name = this.baseName
    if (ctor == null) ctor = this

    // Can't register twice.
    if (this.customElementRegistry.get(name)) return

  // creates anonymous class due to a limitation of CEs only allowing 1 class definition.
    this.customElementRegistry.define(name, toAnonymousClass(ctor), options)
  }
}


export type Constructor = new (...args: any[]) => {};

export function toAnonymousClass<T extends Constructor> (klass: T): T {
  return class extends klass {}
}
