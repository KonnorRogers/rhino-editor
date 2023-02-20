import { assert } from "@esm-bundle/chai";
import { fixture, html } from "@open-wc/testing"
import { TipTapEditor } from '../../src/exports/elements/tip-tap-editor'
import { screen } from "shadow-dom-testing-library"

setup(async () => {
  await import("../../docs/frontend/javascript/entrypoints/character-counter.js")
})

test("Should show rhino editor with character counter", async () => {
  const el = await fixture(html`<extended-rhino-editor></extended-rhino-editor>`) as Element & TipTapEditor

  assert(await screen.findByText(/\d\+ characters/))
})





