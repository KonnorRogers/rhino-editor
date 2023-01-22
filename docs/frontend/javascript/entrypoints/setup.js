import { RhinoEditor } from "rhino-editor/exports/elements/tip-tap-editor.js"

// https://tiptap.dev/api/extensions/character-count
import CharacterCount from "@tiptap/extension-character-count"
import { html } from "lit"

class ExtendedEditor extends RhinoEditor {
  extensions () {
    this.characterCountLimit = 240
    return [
      // Uses all existing extensions so we're only appending
      ...super.extensions(),

      // Adds character counter
      CharacterCount.configure({
        limit: this.characterCountLimit,
      })
    ]
  }

  render () {
    return html`
      ${super.render()}

      <p style="color: gray;">
        ${this.editor?.storage.characterCount.characters()}/${this.characterCountLimit} characters
        <br />
        ${this.editor?.storage.characterCount.words()} words
      </p>
    `
  }
}

ExtendedEditor.define("extended-rhino-editor")

