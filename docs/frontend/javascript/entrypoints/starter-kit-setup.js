import "rhino-editor/exports/styles/trix.css"
import { TipTapEditor } from "rhino-editor/exports/elements/tip-tap-editor.js"

class MyEditor extends TipTapEditor {
  constructor () {
    super()
    this.starterKitOptions = {
      ...this.starterKitOptions,
      heading: {
        // Enable all heading levels
        levels: [1, 2, 3, 4, 5, 6],
      },
      // Remove the gallery, all images are always full size.
      rhinoGallery: false
    }
  }
}

MyEditor.define("my-editor")
