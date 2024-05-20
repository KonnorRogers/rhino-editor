import "rhino-editor"
import { createEditor } from './helpers/create-editor.js'
import { assert } from "@esm-bundle/chai"
import { elementUpdated } from "@open-wc/testing"
import { sendKeys } from "@web/test-runner-commands"
import { html } from "lit"

test("Should not remove existing content when rebuilding editor", async () => {
  const { tiptap, rhinoEditor } = await createEditor(html`
    <div>
      <input type="hidden" id="rhino-input">
      <rhino-editor input="rhino-input"></rhino-editor>
    </div>
  `)

  await rhinoEditor.initializationComplete

  tiptap().focus()
  await sendKeys({ type: "abcd" })

  const content = rhinoEditor.serialize()

  rhinoEditor.starterKitOptions = { ...rhinoEditor.starterKitOptions, bold: false }

  await elementUpdated(rhinoEditor)

  assert.equal(content, rhinoEditor.serialize())
})

test("Should disable bold", async () => {
  const { rhinoEditor } = await createEditor()

  const button = () => rhinoEditor.shadowRoot?.querySelector("role-toolbar [part~='toolbar__button--bold']")

  assert.ok(button())

  rhinoEditor.starterKitOptions = { ...rhinoEditor.starterKitOptions, bold: false }

  await elementUpdated(rhinoEditor)

  assert.isNotOk(button())
})

test("Should disable italic", async () => {
  const { rhinoEditor } = await createEditor()

  const button = () => rhinoEditor.shadowRoot.querySelector("role-toolbar [part~='toolbar__button--italic']")

  assert.ok(button())

  rhinoEditor.starterKitOptions = { ...rhinoEditor.starterKitOptions, italic: false }

  await elementUpdated(rhinoEditor)

  assert.isNotOk(button())
})

test("Should disable strikethrough", async () => {
  const { rhinoEditor } = await createEditor()

  const button = () => rhinoEditor.shadowRoot.querySelector("role-toolbar [part~='toolbar__button--strike']")

  assert.ok(button())

  rhinoEditor.starterKitOptions = { ...rhinoEditor.starterKitOptions, rhinoStrike: false }

  await elementUpdated(rhinoEditor)

  assert.isNotOk(button())
})

test("Should disable rhinoLink", async () => {
  const { rhinoEditor } = await createEditor()

  const button = () => rhinoEditor.shadowRoot.querySelector("role-toolbar [part~='toolbar__button--link']")

  assert.ok(button())

  rhinoEditor.starterKitOptions = { ...rhinoEditor.starterKitOptions, rhinoLink: false }

  await elementUpdated(rhinoEditor)

  assert.isNotOk(button())
})

test("Should disable heading", async () => {
  const { rhinoEditor } = await createEditor()

  const button = () => rhinoEditor.shadowRoot.querySelector("role-toolbar [part~='toolbar__button--heading']")

  assert.ok(button())

  rhinoEditor.starterKitOptions = { ...rhinoEditor.starterKitOptions, heading: false }

  await elementUpdated(rhinoEditor)

  assert.isNotOk(button())
})

test("Should disable blockquote", async () => {
  const { rhinoEditor } = await createEditor()

  const button = () => rhinoEditor.shadowRoot.querySelector("role-toolbar [part~='toolbar__button--blockquote']")

  assert.ok(button())

  rhinoEditor.starterKitOptions = { ...rhinoEditor.starterKitOptions, blockquote: false }

  await elementUpdated(rhinoEditor)

  assert.isNotOk(button())
})


test("Should disable codeBlock", async () => {
  const { rhinoEditor } = await createEditor()

  const button = () => rhinoEditor.shadowRoot.querySelector("role-toolbar [part~='toolbar__button--code-block']")

  assert.ok(button())

  rhinoEditor.starterKitOptions = { ...rhinoEditor.starterKitOptions, codeBlock: false }

  await elementUpdated(rhinoEditor)

  assert.isNotOk(button())
})

test("Should disable bulletList", async () => {
  const { rhinoEditor } = await createEditor()

  const button = () => rhinoEditor.shadowRoot.querySelector("role-toolbar [part~='toolbar__button--bullet-list']")

  assert.ok(button())

  rhinoEditor.starterKitOptions = { ...rhinoEditor.starterKitOptions, bulletList: false }

  await elementUpdated(rhinoEditor)

  assert.isNotOk(button())
})

test("Should disable orderedList", async () => {
  const { rhinoEditor } = await createEditor()

  const button = () => rhinoEditor.shadowRoot.querySelector("role-toolbar [part~='toolbar__button--ordered-list']")

  assert.ok(button())

  rhinoEditor.starterKitOptions = { ...rhinoEditor.starterKitOptions, orderedList: false }

  await elementUpdated(rhinoEditor)

  assert.isNotOk(button())
})

test("Should disable attachments", async () => {
  const { rhinoEditor } = await createEditor()

  const button = () => rhinoEditor.shadowRoot.querySelector("role-toolbar [part~='toolbar__button--attach-files']")

  assert.ok(button())

  rhinoEditor.starterKitOptions = { ...rhinoEditor.starterKitOptions, rhinoAttachment: false, rhinoGallery: false }

  await elementUpdated(rhinoEditor)

  assert.isNotOk(button())
})

test("Should disable undo", async () => {
  const { rhinoEditor } = await createEditor()

  const button = () => rhinoEditor.shadowRoot.querySelector("role-toolbar [part~='toolbar__button--undo']")

  assert.ok(button())

  rhinoEditor.starterKitOptions = { ...rhinoEditor.starterKitOptions, history: false }

  await elementUpdated(rhinoEditor)

  assert.isNotOk(button())
})

test("Should disable redo", async () => {
  const { rhinoEditor } = await createEditor()

  const button = () => rhinoEditor.shadowRoot.querySelector("role-toolbar [part~='toolbar__button--redo']")

  assert.ok(button())

  rhinoEditor.starterKitOptions = { ...rhinoEditor.starterKitOptions, history: false }

  await elementUpdated(rhinoEditor)

  assert.isNotOk(button())
})

test("Should disable decreaseIndentation", async () => {
  const { rhinoEditor } = await createEditor()

  const button = () => rhinoEditor.shadowRoot.querySelector("role-toolbar [part~='toolbar__button--decrease-indentation']")

  assert.ok(button())

  rhinoEditor.starterKitOptions = { ...rhinoEditor.starterKitOptions, decreaseIndentation: false }

  await elementUpdated(rhinoEditor)

  assert.isNotOk(button())
})

test("Should disable increaseIndentation", async () => {
  const { rhinoEditor } = await createEditor()

  const button = () => rhinoEditor.shadowRoot.querySelector("role-toolbar [part~='toolbar__button--increase-indentation']")

  assert.ok(button())

  rhinoEditor.starterKitOptions = { ...rhinoEditor.starterKitOptions, increaseIndentation: false }

  await elementUpdated(rhinoEditor)

  assert.isNotOk(button())
})
