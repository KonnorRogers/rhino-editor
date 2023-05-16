// @ts-check
import { TipTapEditor } from "../../exports/elements/tip-tap-editor.js"
import { fixture, assert, aTimeout } from "@open-wc/testing"
import { html } from "lit"

test("Should only render a textbox once", async () => {
  /** @type {TipTapEditor} */
  const editor = await fixture(html`<rhino-editor></rhino-editor>`)

  TipTapEditor.define()
  await aTimeout(1)

  editor.disconnectedCallback()
  await aTimeout(1)
  editor.connectedCallback()
  await aTimeout(1)

  assert.equal(editor.querySelectorAll("[role='textbox']").length, 1)
})

