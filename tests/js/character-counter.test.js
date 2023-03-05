import { assert } from "@esm-bundle/chai";
import { aTimeout, elementUpdated, fixture, html } from "@open-wc/testing"
import { screen } from "shadow-dom-testing-library"


test("Should show rhino editor with character counter", async () => {
  await import("../../docs/frontend/javascript/entrypoints/character-counter.js")

  const el = await fixture(html`
    <input id="input" value="<p>hello there friends</p>">
    <extended-rhino-editor input="input"></extended-rhino-editor>
  `)

  await elementUpdated(el)

  await aTimeout(1)
  // console.log(document.querySelector("extended-rhino-editor").shadowRoot.innerHTML)

  const characters = await screen.findByShadowText(/19\/240 characters/i)
  const words = await screen.findByShadowText(/3 words/i)

  assert(characters)
  assert(words)
})





