import { Plugin } from "prosemirror-state";

export interface FirefoxCaretPluginOptions {
}

/**
 * Plugin to fix firefox cursor disappearing inside contenteditable.
 * https://github.com/ProseMirror/prosemirror/issues/1113#issue-780389225
 */
export function FirefoxCaretFixPlugin() {
  let focusing = false;
  return new Plugin({
    props: {
      handleDOMEvents: {
        focus: (view) => {
          if (focusing) {
            focusing = false;
          } else {
            focusing = true;
            setTimeout(() => {
              view.dom.blur();
              view.dom.focus();
            });
          }
          return false;
        },
      },
    },
  });
}
