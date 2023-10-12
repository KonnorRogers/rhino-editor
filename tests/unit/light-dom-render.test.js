// @ts-check
import "rhino-editor"
import { fixture, assert, aTimeout } from "@open-wc/testing"
import { html } from "lit"

test("Should only render a textbox once", async () => {
  const rhinoEditor = await fixture(html`<rhino-editor>
    <div slot="editor" aria-describedby="errors" aria-invalid="true" class="my-class"></div>
  </rhino-editor>`)

  await aTimeout(100)

  assert.equal(rhinoEditor.querySelectorAll("[role='textbox']").length, 1)

  const editor = rhinoEditor.querySelector(".trix-content")

  // The attributes we put on the editor should not get overwritten when the rendering process happens.
  assert.equal(editor?.getAttribute("aria-describedby"), "errors")
  assert.equal(editor?.getAttribute("aria-invalid"), "true")

  // Make sure classes don't get overwritten
  assert(editor?.classList.contains("my-class"))
  assert(editor?.classList.contains("trix-content"))
  console.log(editor.outerHTML)
  assert(editor?.classList.contains("tiptap"))
})

