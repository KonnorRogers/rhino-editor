// @ts-check
import { TipTapEditor } from "../../exports/elements/tip-tap-editor.js"
import { fixture, assert, aTimeout } from "@open-wc/testing"
import { html } from "lit"

test("Should only render a textbox once", async () => {
  /** @type {TipTapEditor} */
  const rhinoEditor = await fixture(html`<rhino-editor>
    <div slot="editor" aria-describedby="errors" aria-invalid="true" class="my-class"></div>
  </rhino-editor>`)

  TipTapEditor.define()
  await aTimeout(100)

  assert.equal(rhinoEditor.querySelectorAll("[role='textbox']").length, 1)

  const editor = rhinoEditor.querySelector(".trix-content")

  // The attributes we put on the editor should not get overwritten when the rendering process happens.
  assert.equal(editor?.getAttribute("aria-describedby"), "errors")
  assert.equal(editor?.getAttribute("aria-invalid"), "true")

  // Make sure classes don't get overwritten
  assert(editor?.classList.contains("my-class"))
  assert(editor?.classList.contains("trix-content"))
  assert(editor?.classList.contains("tiptap"))
})

