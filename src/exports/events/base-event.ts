/**
 * Base class to be extended.
 */
export class BaseEvent extends Event {
  static eventName: string;
  constructor(name: string, options?: EventInit | undefined) {
    if (options == null) options = {};
    if (options.bubbles == null) options.bubbles = true;
    if (options.composed == null) options.composed = true;
    if (options.cancelable == null) options.cancelable = true;
    super(name, options);
  }
}
