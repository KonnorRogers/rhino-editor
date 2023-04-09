import "rhino-editor/exports/styles/trix.css"
import { TipTapEditor } from "rhino-editor/exports/elements/tip-tap-editor.js"

class MyEditor extends TipTapEditor {
  constructor () {
    super()
    this.starterKit = {
      ...super.starterKit,
      heading: {
        // Enable all heading levels
        levels: [1, 2, 3, 4, 5, 6],
      },
    }
    this.rhinoStarterKit = {
      ...super.rhinoStarterKit,
      gallery: false
    }
  }
}

MyEditor.define("my-editor")
