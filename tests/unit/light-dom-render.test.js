// @ts-check
import { TipTapEditor } from "../../exports/elements/tip-tap-editor.js"
import { fixture, assert, aTimeout } from "@open-wc/testing"
import { html } from "lit"

test("Should only render a textbox once", async () => {
  /** @type {TipTapEditor} */
  const editor = await fixture(html`<rhino-editor aria-describedby="errors" aria-invalid="true" class="my-class"></rhino-editor>`)

  TipTapEditor.define()
  await aTimeout(1)

  assert.equal(editor.querySelectorAll("[role='textbox']").length, 1)

  // The attributes we put on the editor should not get overwritten when the rendering process happens.
  assert.equal(editor.getAttribute("aria-describedby"), "errors")
  assert.equal(editor.getAttribute("aria-invalid"), "true")

  // Make sure classes don't get overwritten
  assert(editor.classList.contains("my-class"))
})

