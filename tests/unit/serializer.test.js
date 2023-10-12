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

  await aTimeout(0)

  const rhinoEditor = div.querySelector("rhino-editor")
  const input = div.querySelector("input")

  assert.equal(rhinoEditor.serializer, "html")
  assert.equal(input.value, "<p></p>")

  rhinoEditor.serializer = "json"

  await rhinoEditor.updateComplete

  assert.equal(JSON.parse(input.value)["type"], "doc")
})
