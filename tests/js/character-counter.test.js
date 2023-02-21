import { assert } from "@esm-bundle/chai";
import { elementUpdated, fixture, html } from "@open-wc/testing"
import { TipTapEditor } from '../../exports/bundle/index.module.js'
import { screen } from "shadow-dom-testing-library"

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
    return super.render()
    // return html`
    //   ${super.render()}
    //
    //   <p style="color: gray;">
    //     ${this.editor?.storage.characterCount.characters()}/${this.characterCountLimit} characters
    //     <br />
    //     ${this.editor?.storage.characterCount.words()} words
    //   </p>
    // `
  }
}

setup(() => {
  ExtendedEditor.define("extended-rhino-editor")
})


test("Should show rhino editor with character counter", async () => {
  const el = await fixture(html`
    <extended-rhino-editor></extended-rhino-editor>
  `)

  await elementUpdated(el)


  const text = await screen.findByShadowText(/\d+ characters/i)

  assert(text)

})





