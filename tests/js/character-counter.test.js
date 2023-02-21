import { assert } from "@esm-bundle/chai";
import { fixture, html } from "@open-wc/testing"
// import { TipTapEditor } from '../../src/exports/elements/tip-tap-editor'
import { screen } from "shadow-dom-testing-library"

import { TipTapEditor } from "../../exports/elements/tip-tap-editor.js"

// https://tiptap.dev/api/extensions/character-count
import CharacterCount from "https://cdn.skypack.dev/@tiptap/extension-character-count"

class ExtendedEditor extends TipTapEditor {
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

// setup(() => {
//   ExtendedEditor.define("extended-rhino-editor")
// })


test("Should show rhino editor with character counter", async () => {

  window.customElements.define("extended-rhino-editor", class extends ExtendedEditor{})
  const el = await fixture(html`<extended-rhino-editor></extended-rhino-editor>`)

  assert(await screen.findByText(/\d\+ characters/))
})





