// @ts-check
import "rhino-editor"
import { aTimeout, assert, elementUpdated } from "@open-wc/testing"
import { html } from "lit"
import { sendKeys } from '@web/test-runner-commands';
import { createEditor } from "./helpers/create-editor.js";

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
  assert.equal(increaseIndentation.getAttribute("part").includes("toolbar__button--disabled"), true)
  assert.equal(decreaseIndentation.getAttribute("part").includes("toolbar__button--disabled"), true)

  // Lists should not be disabled, but not active either
  assert.equal(bulletListButton.getAttribute("aria-disabled"), "false")
  assert.equal(bulletListButton.getAttribute("aria-pressed"), "false")
  assert.equal(bulletListButton.getAttribute("part").includes("toolbar__button--disabled"), false)
  assert.equal(bulletListButton.getAttribute("part").includes("toolbar__button--active"), false)

  assert.equal(orderedListButton.getAttribute("aria-disabled"), "false")
  assert.equal(orderedListButton.getAttribute("aria-pressed"), "false")
  assert.equal(orderedListButton.getAttribute("part").includes("toolbar__button--disabled"), false)
  assert.equal(orderedListButton.getAttribute("part").includes("toolbar__button--active"), false)

  bulletListButton.click()
  await elementUpdated(rhinoEditor)

  // Can't nest until we have a new line. But we can "decreaseIndentation".
  assert.equal(increaseIndentation.getAttribute("aria-disabled"), "true")
  assert.equal(decreaseIndentation.getAttribute("aria-disabled"), "false")
  assert.equal(increaseIndentation.getAttribute("part").includes("toolbar__button--disabled"), true)
  assert.equal(decreaseIndentation.getAttribute("part").includes("toolbar__button--disabled"), false)

  // only bullet list should be enabled and pressed
  assert.equal(bulletListButton.getAttribute("aria-disabled"), "false")
  assert.equal(bulletListButton.getAttribute("aria-pressed"), "true")
  assert.equal(bulletListButton.getAttribute("part").includes("toolbar__button--disabled"), false)
  assert.equal(bulletListButton.getAttribute("part").includes("toolbar__button--active"), true)

  assert.equal(orderedListButton.getAttribute("aria-disabled"), "false")
  assert.equal(orderedListButton.getAttribute("aria-pressed"), "false")
  assert.equal(orderedListButton.getAttribute("part").includes("toolbar__button--disabled"), false)
  assert.equal(orderedListButton.getAttribute("part").includes("toolbar__button--active"), false)

  assert(tiptap().querySelector("ul"))
  assert(!tiptap().querySelector("ol"))

  // Lets turn it into an ordered list now
  orderedListButton.click()
  await elementUpdated(rhinoEditor)

  // Can't nest until we have a new line. But we can decreaseIndentation
  assert.equal(increaseIndentation.getAttribute("aria-disabled"), "true")
  assert.equal(decreaseIndentation.getAttribute("aria-disabled"), "false")
  assert.equal(increaseIndentation.getAttribute("part").includes("toolbar__button--disabled"), true)
  assert.equal(decreaseIndentation.getAttribute("part").includes("toolbar__button--disabled"), false)

  // only ordered list should be enabled and pressed
  assert.equal(bulletListButton.getAttribute("aria-disabled"), "false")
  assert.equal(bulletListButton.getAttribute("aria-pressed"), "false")
  assert.equal(bulletListButton.getAttribute("part").includes("toolbar__button--disabled"), false)
  assert.equal(bulletListButton.getAttribute("part").includes("toolbar__button--active"), false)

  assert.equal(orderedListButton.getAttribute("aria-disabled"), "false")
  assert.equal(orderedListButton.getAttribute("aria-pressed"), "true")
  assert.equal(orderedListButton.getAttribute("part").includes("toolbar__button--disabled"), false)
  assert.equal(orderedListButton.getAttribute("part").includes("toolbar__button--active"), true)

  tiptap().focus()
  await aTimeout(1)
  // Add a new line
  await sendKeys({ press: "Enter" })
  await elementUpdated(rhinoEditor)
  await aTimeout(1)

  // Now we can nest
  assert.equal(increaseIndentation.getAttribute("aria-disabled"), "false")
  assert.equal(decreaseIndentation.getAttribute("aria-disabled"), "false")
  assert.equal(increaseIndentation.getAttribute("part").includes("toolbar__button--disabled"), false)
  assert.equal(decreaseIndentation.getAttribute("part").includes("toolbar__button--disabled"), false)

  increaseIndentation.click()
  await elementUpdated(rhinoEditor)

  // Now we can't nest. Only decreaseIndentation
  assert.equal(increaseIndentation.getAttribute("aria-disabled"), "true")
  assert.equal(decreaseIndentation.getAttribute("aria-disabled"), "false")
  assert.equal(increaseIndentation.getAttribute("part").includes("toolbar__button--disabled"), true)
  assert.equal(decreaseIndentation.getAttribute("part").includes("toolbar__button--disabled"), false)

  // only ordered list should be enabled and pressed
  assert.equal(bulletListButton.getAttribute("aria-disabled"), "false")
  assert.equal(bulletListButton.getAttribute("aria-pressed"), "false")
  assert.equal(bulletListButton.getAttribute("part").includes("toolbar__button--disabled"), false)
  assert.equal(bulletListButton.getAttribute("part").includes("toolbar__button--active"), false)

  assert.equal(orderedListButton.getAttribute("aria-disabled"), "false")
  assert.equal(orderedListButton.getAttribute("aria-pressed"), "true")
  assert.equal(orderedListButton.getAttribute("part").includes("toolbar__button--disabled"), false)
  assert.equal(orderedListButton.getAttribute("part").includes("toolbar__button--active"), true)

  assert(tiptap().querySelector("ol > li > ol"))

  // Change nested list to <ul>
  bulletListButton.click()
  await elementUpdated(rhinoEditor)

  // We should only see bulletList as active
  assert.equal(bulletListButton.getAttribute("aria-disabled"), "false")
  assert.equal(bulletListButton.getAttribute("aria-pressed"), "true")
  assert.equal(bulletListButton.getAttribute("part").includes("toolbar__button--disabled"), false)
  assert.equal(bulletListButton.getAttribute("part").includes("toolbar__button--active"), true)

  assert.equal(orderedListButton.getAttribute("aria-disabled"), "false")
  assert.equal(orderedListButton.getAttribute("aria-pressed"), "false")
  assert.equal(orderedListButton.getAttribute("part").includes("toolbar__button--disabled"), false)
  assert.equal(orderedListButton.getAttribute("part").includes("toolbar__button--active"), false)

  assert(tiptap().querySelector("ol > li > ul"))

  // Add another new line. This is when things get weird. Make sure only the bulletList is active
  await sendKeys({ type: "thing2" })
  await sendKeys({ press: "Enter" })
  await elementUpdated(rhinoEditor)

  assert.equal(bulletListButton.getAttribute("aria-disabled"), "false")
  assert.equal(bulletListButton.getAttribute("aria-pressed"), "true")
  assert.equal(bulletListButton.getAttribute("part").includes("toolbar__button--disabled"), false)
  assert.equal(bulletListButton.getAttribute("part").includes("toolbar__button--active"), true)

  assert.equal(orderedListButton.getAttribute("aria-disabled"), "false")
  assert.equal(orderedListButton.getAttribute("aria-pressed"), "false")
  assert.equal(orderedListButton.getAttribute("part").includes("toolbar__button--disabled"), false)
  assert.equal(orderedListButton.getAttribute("part").includes("toolbar__button--active"), false)
})
