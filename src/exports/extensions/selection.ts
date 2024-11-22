import { Extension } from "@tiptap/core";
import { Plugin, PluginKey, TextSelection } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { DecorationAttrs } from "@tiptap/pm/view";

export type RhinoSelectionOptions = {
  HTMLAttributes?: DecorationAttrs;
};

const selectionPlugin = (options: RhinoSelectionOptions) => {
  return new Plugin({
    key: new PluginKey("rhino-selection"),
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, set) {
        set = set.map(tr.mapping, tr.doc);

        set = set.remove(set.find());

        // if (!tr.selectionSet) {
        //   return set
        // }

        // Whether selection was explicitly updated by this transaction.
        const { doc, selection } = tr;

        let deco: Decoration | null = null;

        if (selection.to !== selection.from) {
          // Highlight existing selection
          deco = Decoration.inline(
            selection.from,
            selection.to,
            options.HTMLAttributes || {},
          );
        } else {
          // Show a fake cursor.
          let widget = document.createElement("placeholder");
          widget.setAttribute("class", "fake-cursor-selection");
          widget.setAttribute("readonly", "");
          widget.setAttribute("contenteditable", "false");
          deco = Decoration.widget(selection.to, widget, {});
        }

        if (deco) {
          set = DecorationSet.create(doc, [deco]);
        }

        return set;
      },
    },
    props: {
      decorations(state) {
        return this.getState(state);
      },
      handleDOMEvents: {
        keydown(view, event) {
          if (event.key === "ArrowLeft") {
            const { selection } = view.state;
            const pos = selection.$from;

            // This really bizarre piece of code is to "fix" some weird issue with Decorations and Firefox getting "stuck" on them.
            // Basically if youre on a line like this:
            // -> Hello
            // And your cursor is before the H in Hello, and you hit the "LeftArrow" in Firefox, it will loop to the front. Like so:
            // Hi
            // |Hello -> "LeftArrow" -> Hello|
            // ^ initial cursor position     ^ new cursor position
            // instead of moving up to the line that says "Hi"
            if (selection.empty && pos.parentOffset === 0) {
              if (selection.from - 2 <= 0) {
                // Call `event.preventDefault()` so that the cursor doesn't jump to front if we're at start of document.
                event.preventDefault();
                return false;
              }

              const tr = view.state.tr.setSelection(
                TextSelection.create(
                  view.state.doc,
                  Math.max(selection.from - 2, 0),
                  selection.from,
                ),
              );
              view.dispatch(tr);
              return true;
            }
          }
          return false;
        },
      },
    },
  });
};

/**
 * A plugin that maintains selection "highlighting" even while the editor does not have focus. This is useful for things like entering in links.
 */
export const SelectionPlugin = Extension.create({
  name: "rhino-selection",
  addOptions(): RhinoSelectionOptions {
    return {
      HTMLAttributes: {
        class: "rhino-selection",
        readonly: "",
      },
    };
  },

  addProseMirrorPlugins() {
    return [selectionPlugin(this.options)];
  },
});
