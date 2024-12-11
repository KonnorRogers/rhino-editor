import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
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

        const { doc, selection } = tr;

        let deco: Decoration | null = null;

        if (selection.to !== selection.from) {
          // Highlight existing selection
          deco = Decoration.inline(
            selection.from,
            selection.to,
            options.HTMLAttributes || {},
          );
        }

        if (deco) {
          return DecorationSet.create(doc, [deco]);
        }

        return DecorationSet.empty;
      },
    },
    props: {
      decorations(state) {
        return this.getState(state);
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
