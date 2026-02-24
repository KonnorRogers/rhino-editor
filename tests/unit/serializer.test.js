import "rhino-editor"
import { assert, aTimeout, fixture, waitUntil } from "@open-wc/testing"
import { html } from "lit"
import { readFile, sendKeys } from '@web/test-runner-commands';
import sinon from "sinon"

test("It should properly update the input element when the serializer changes", async () => {
  const div = await fixture(html`<div>
    <input id="input">
    <rhino-editor input="input"></rhino-editor>
  </div>`)

  await div.querySelector("rhino-editor").initializationComplete
  await aTimeout(1)

  const rhinoEditor = div.querySelector("rhino-editor")
  const input = div.querySelector("input")

  assert.equal(rhinoEditor.serializer, "html")
  assert.equal(input.value, "<p><br></p>")

  rhinoEditor.serializer = "json"

  await rhinoEditor.updateComplete

  assert.equal(JSON.parse(input.value)["type"], "doc")
})

test("It should not grow spacing when reloading empty paragraphs", async () => {
  const div = await fixture(html`<div>
    <input id="input" value="<p>Hello</p><p><br></p><p>World</p>">
    <rhino-editor input="input"></rhino-editor>
  </div>`)

  await div.querySelector("rhino-editor").initializationComplete
  await aTimeout(1)

  const input = div.querySelector("input")

  // The <br> sentinel should be stripped on load and re-added on serialize,
  // not interpreted as a HardBreak that grows spacing
  assert.notInclude(input.value, "<br><br>")
  assert.include(input.value, "<p><br></p>")
})
