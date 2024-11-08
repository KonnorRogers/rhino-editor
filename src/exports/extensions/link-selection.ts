import { Extension } from "@tiptap/core"
import { Plugin, PluginKey } from "@tiptap/pm/state"
import { Decoration, DecorationSet } from "@tiptap/pm/view"

const linkSelectionPlugin = new Plugin({
  key: new PluginKey("rhino-link-selection"),
  state: {
    init() {
      return DecorationSet.empty
    },
    apply(tr, set) {
      set = set.map(tr.mapping, tr.doc)

      if (tr.selectionSet) {
        const { doc, selection } = tr

        // Just remove everything.
        set.remove(set.find())
        let speckles = []
        speckles.push(Decoration.inline(selection.from, selection.to, {style: "background: rgba(180, 180, 180, 0.54);"}))

        set = DecorationSet.create(doc, speckles)
      }
      return set
    }
  },
  props: {
    decorations(state) { return this.getState(state) }
  }
})

export const LinkSelectionPlugin = Extension.create({
  name: "rhino-link-selection",
  addProseMirrorPlugins () {
    return [
      linkSelectionPlugin
    ]
  }
})


