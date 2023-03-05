import { assert } from "@esm-bundle/chai";
import { elementUpdated, fixture, html } from "@open-wc/testing"
import { screen } from "shadow-dom-testing-library"


test("Should show rhino editor with character counter", async () => {
  await import("../../docs/frontend/javascript/entrypoints/character-counter.js")

  const el = await fixture(html`
    <extended-rhino-editor></extended-rhino-editor>
  `)


  await elementUpdated(el)

  // screen.debug()

  const text = await screen.findByShadowText(/\d+ characters/i)

  assert(text)

})





