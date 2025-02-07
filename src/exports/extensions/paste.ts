import { Plugin, PluginKey } from "@tiptap/pm/state";
import { RhinoPasteEvent } from "../events/rhino-paste-event.js";

export interface PasteOptions {}

// Super simple plugin that dispatches a paste event. This is convenient way to make this hard to override.
export function Paste() {
  const handledEvents = new WeakMap();

  return new Plugin({
    key: new PluginKey("rhino-paste-event"),
    props: {
      handlePaste(view, event) {
        const { clipboardData } = event;

        if (handledEvents.has(event)) {
          // This event has already processed. This prevents emitting the event twice.
          return false;
        }

        handledEvents.set(event, null);

        // We always return false to allow other extensions to actually handle the paste via props.
        if (event.defaultPrevented) {
          return false;
        }

        const rhinoPasteEvent = new RhinoPasteEvent(clipboardData);
        view.dom.dispatchEvent(rhinoPasteEvent);

        return true;

        // @TODO: Future enhancements for pasting
        // https://github.com/basecamp/trix/blob/fda14c5ae88a0821cf8999a53dcb3572b4172cf0/src/trix/controllers/level_0_input_controller.js#L39
        // https://github.com/basecamp/trix/blob/fda14c5ae88a0821cf8999a53dcb3572b4172cf0/src/trix/controllers/level_2_input_controller.js#L39
      },
    },
  });
}
