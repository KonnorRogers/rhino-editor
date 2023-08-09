import "rhino-editor"
import { aTimeout, assert, elementUpdated } from "@open-wc/testing"
import { html } from "lit"
import { sendKeys } from '@web/test-runner-commands';
import { createEditor } from "./create-editor.js";

const editorHTML = html`<rhino-editor></rhino-editor>`


test("Should allow swapping between list-items and sinking them appropriately", async () => {
  const { tiptap, rhinoEditor } = await createEditor(editorHTML)

  tiptap().focus()
  await sendKeys({ type: "Thing" })

  const bulletListButton = rhinoEditor.shadowRoot?.querySelector("[part~='toolbar__button--bullet-list']")
  const orderedListButton = rhinoEditor.shadowRoot?.querySelector("[part~='toolbar__button--ordered-list']")

  const increaseIndentation = rhinoEditor.shadowRoot.querySelector("[part~='toolbar__button--increase-indentation']")
  const decreaseIndentation = rhinoEditor.shadowRoot.querySelector("[part~='toolbar__button--decrease-indentation']")

  // Indentation should be disabled to start
  assert.equal(increaseIndentation.getAttribute("aria-disabled"), "true")
  assert.equal(decreaseIndentation.getAttribute("aria-disabled"), "true")
  assert(increaseIndentation.getAttribute("part").includes("toolbar__button--disabled"))
  assert(decreaseIndentation.getAttribute("part").includes("toolbar__button--disabled"))

  // Lists should not be disabled, but not active either
  assert.equal(bulletListButton.getAttribute("aria-disabled"), "false")
  assert.equal(bulletListButton.getAttribute("aria-pressed"), "false")
  assert(bulletListButton.getAttribute("part").includes("toolbar__button--disabled") == false)
  assert(bulletListButton.getAttribute("part").includes("toolbar__button--active") == false)

  assert.equal(orderedListButton.getAttribute("aria-disabled"), "false")
  assert.equal(orderedListButton.getAttribute("aria-pressed"), "false")
  assert(orderedListButton.getAttribute("part").includes("toolbar__button--disabled") == false)
  assert(orderedListButton.getAttribute("part").includes("toolbar__button--active") == false)

  bulletListButton.click()
  await elementUpdated(rhinoEditor)

  // Can't nest until we have a new line
  assert.equal(increaseIndentation.getAttribute("aria-disabled"), "true")
  assert.equal(decreaseIndentation.getAttribute("aria-disabled"), "true")
  assert(increaseIndentation.getAttribute("part").includes("toolbar__button--disabled"))
  assert(decreaseIndentation.getAttribute("part").includes("toolbar__button--disabled"))

  // only bullet list should be enabled and pressed
  assert.equal(bulletListButton.getAttribute("aria-disabled"), "false")
  assert.equal(bulletListButton.getAttribute("aria-pressed"), "true")
  assert(bulletListButton.getAttribute("part").includes("toolbar__button--disabled") == false)
  assert(bulletListButton.getAttribute("part").includes("toolbar__button--active") == true)

  assert.equal(orderedListButton.getAttribute("aria-disabled"), "false")
  assert.equal(orderedListButton.getAttribute("aria-pressed"), "false")
  assert(orderedListButton.getAttribute("part").includes("toolbar__button--disabled") == false)
  assert(orderedListButton.getAttribute("part").includes("toolbar__button--active") == false)

  assert(tiptap().querySelector("ul"))
  assert(!tiptap().querySelector("ol"))

  // Lets turn it into an ordered list now
  orderedListButton.click()
  await elementUpdated(rhinoEditor)

  // Can't nest until we have a new line
  assert.equal(increaseIndentation.getAttribute("aria-disabled"), "true")
  assert.equal(decreaseIndentation.getAttribute("aria-disabled"), "true")
  assert(increaseIndentation.getAttribute("part").includes("toolbar__button--disabled"))
  assert(decreaseIndentation.getAttribute("part").includes("toolbar__button--disabled"))

  // only ordered list should be enabled and pressed
  assert.equal(bulletListButton.getAttribute("aria-disabled"), "false")
  assert.equal(bulletListButton.getAttribute("aria-pressed"), "false")
  assert(bulletListButton.getAttribute("part").includes("toolbar__button--disabled") == false)
  assert(bulletListButton.getAttribute("part").includes("toolbar__button--active") == false)

  assert.equal(orderedListButton.getAttribute("aria-disabled"), "false")
  assert.equal(orderedListButton.getAttribute("aria-pressed"), "true")
  assert(orderedListButton.getAttribute("part").includes("toolbar__button--disabled") == false)
  assert(orderedListButton.getAttribute("part").includes("toolbar__button--active") == true)

  // Add a new line
  await sendKeys({ press: "Enter" })
  await elementUpdated(rhinoEditor)

  // Now we can nest
  assert.equal(increaseIndentation.getAttribute("aria-disabled"), "false")
  assert.equal(decreaseIndentation.getAttribute("aria-disabled"), "false")
  assert(increaseIndentation.getAttribute("part").includes("toolbar__button--disabled") == false)
  assert(decreaseIndentation.getAttribute("part").includes("toolbar__button--disabled") == false)

  increaseIndentation.click()
  await elementUpdated(rhinoEditor)

  // Now we can't nest
  assert.equal(increaseIndentation.getAttribute("aria-disabled"), "true")
  assert.equal(decreaseIndentation.getAttribute("aria-disabled"), "true")
  assert(increaseIndentation.getAttribute("part").includes("toolbar__button--disabled") == true)
  assert(decreaseIndentation.getAttribute("part").includes("toolbar__button--disabled") == true)

  // only ordered list should be enabled and pressed
  assert.equal(bulletListButton.getAttribute("aria-disabled"), "false")
  assert.equal(bulletListButton.getAttribute("aria-pressed"), "false")
  assert(bulletListButton.getAttribute("part").includes("toolbar__button--disabled") == false)
  assert(bulletListButton.getAttribute("part").includes("toolbar__button--active") == false)

  assert.equal(orderedListButton.getAttribute("aria-disabled"), "false")
  assert.equal(orderedListButton.getAttribute("aria-pressed"), "true")
  assert(orderedListButton.getAttribute("part").includes("toolbar__button--disabled") == false)
  assert(orderedListButton.getAttribute("part").includes("toolbar__button--active") == true)

  assert(tiptap().querySelector("ol > li > ol"))

  // Change nested list to <ul>
  bulletListButton.click()
  await elementUpdated(rhinoEditor)

  // We should only see bulletList as active
  assert.equal(bulletListButton.getAttribute("aria-disabled"), "false")
  assert.equal(bulletListButton.getAttribute("aria-pressed"), "true")
  assert(bulletListButton.getAttribute("part").includes("toolbar__button--disabled") == false)
  assert(bulletListButton.getAttribute("part").includes("toolbar__button--active") == true)

  assert.equal(orderedListButton.getAttribute("aria-disabled"), "false")
  assert.equal(orderedListButton.getAttribute("aria-pressed"), "false")
  assert(orderedListButton.getAttribute("part").includes("toolbar__button--disabled") == false)
  assert(orderedListButton.getAttribute("part").includes("toolbar__button--active") == false)

  assert(tiptap().querySelector("ol > li > ul"))
})
