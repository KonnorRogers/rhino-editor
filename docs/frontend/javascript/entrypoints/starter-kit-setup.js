import "rhino-editor/exports/styles/trix.css"
import { TipTapEditor } from "rhino-editor/exports/elements/tip-tap-editor.js"

class MyEditor extends TipTapEditor {
  constructor () {
    super()
    this.starterKit = {
      ...super.starterKit,
      history: false
    }
    this.rhinoStarterKit = {
      ...super.rhinoStarterKit,
      placeholder: { placeholder: "I'm a different placeholder" }
    }
  }
}

MyEditor.define("my-editor")
