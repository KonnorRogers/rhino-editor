import { Extension } from "@tiptap/core";
import {
  Plugin,
  PluginKey,
} from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { DecorationAttrs } from "@tiptap/pm/view";

export type RhinoSelectionOptions = {
  HTMLAttributes?: DecorationAttrs;
};

const selectionPlugin = (options: RhinoSelectionOptions) => {
  const plugin = new Plugin({
    key: new PluginKey("rhino-selection"),
    state: {
      init() {
        return DecorationSet.empty;
      },
      apply(tr, set) {
        if (!tr.getMeta(plugin)) {
          return set;
        }
        set = set.map(tr.mapping, tr.doc);

        const selections = set.find(undefined, undefined, (deco) => {
          return deco.rhinoSelection === true;
        });

        if (selections?.length >= 1) {
          set = set.remove(selections);
        }

        const { doc, selection } = tr;

        let deco: Decoration | null = null;

        if (selection.to !== selection.from) {
          // Highlight existing selection
          deco = Decoration.inline(
            selection.from,
            selection.to,
            options.HTMLAttributes || {},
            {
              rhinoSelection: true,
            },
          );
        }

        if (deco) {
          set = set.add(doc, [deco]);
        }

        return set;
      },
    },
    props: {
      handleDOMEvents: {
        blur: (view) => {
          const { tr } = view.state;

          const transaction = tr.setMeta(plugin, {
            from: tr.selection.from,
            to: tr.selection.to,
          });

          view.dispatch(transaction);
        },

        focus: (view) => {
          const { tr } = view.state;

          const transaction = tr.setMeta(plugin, {
            from: tr.selection.from,
            to: tr.selection.to,
          });

          view.dispatch(transaction);
        },
      },
      decorations(state) {
        return this.getState(state);
      },
    },
  });
  return plugin;
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
