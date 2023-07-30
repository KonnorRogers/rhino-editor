// @ts-check
import "rhino-editor"
import { TipTapEditor } from "../../exports/elements/tip-tap-editor.js"
import { fixture, assert, aTimeout } from "@open-wc/testing"
import { html } from "lit"
import { sendKeys } from '@web/test-runner-commands';

/** @type {TipTapEditor} */
let rhinoEditor

/** @type {() => HTMLOrSVGElement & ElementContentEditable} */
let tiptap

async function createEditor () {
  rhinoEditor = await fixture(html`<rhino-editor></rhino-editor>`)

  /** @type {HTMLDivElement & ElementContentEditable} */
  // @ts-expect-error
  tiptap = () => rhinoEditor.querySelector(".ProseMirror[role='textbox']")
}

// "rhino-file-accept", "rhino-attachment-add", "rhino-attachment-remove", "rhino-paste", and "rhino-selection-change" are handled in the "specifying-accepted-file-types" / "index" tests
// due to it requiring playwright APIs.

test("rhino-before-initialize", async () => {
  let called = false

  function handleEvent () {
    called = true
  }

  document.addEventListener("rhino-before-initialize", handleEvent)
  await createEditor()

  assert.equal(called, true)
  document.removeEventListener("rhino-before-initialize", handleEvent)
})
test("rhino-initialize", async () => {
  let called = false

  function handleEvent () {
    called = true
  }

  document.addEventListener("rhino-initialize", handleEvent)
  await createEditor()

  assert.equal(called, false)

  // Initialize takes a tick. Lets check after a quick timeout.
  await aTimeout(1)

  assert.equal(called, true)

  document.removeEventListener("rhino-initialize", handleEvent)
})
test("rhino-focus", async () => {
  let called = false

  function handleEvent () {
    called = true
  }

  document.addEventListener("rhino-focus", handleEvent)
  await createEditor()
  await aTimeout(1)
  tiptap().focus()

  assert.equal(called, true)

  document.removeEventListener("rhino-focus", handleEvent)
})
test("rhino-blur", async () => {
  let called = false

  function handleEvent () {
    called = true
  }

  document.addEventListener("rhino-blur", handleEvent)
  await createEditor()
  await aTimeout(1)
  tiptap().focus()

  assert.equal(called, false)

  tiptap().blur()

  assert.equal(called, true)

  document.removeEventListener("rhino-blur", handleEvent)
})
test("rhino-change", async () => {
  let called = false

  function handleEvent () {
    called = true
  }

  document.addEventListener("rhino-change", handleEvent)
  await createEditor()
  await aTimeout(1)

  tiptap().focus()

  assert.equal(called, false)

  await sendKeys({
    type: "abcd"
  })

  assert.equal(called, true)

  document.removeEventListener("rhino-change", handleEvent)
})

// TODO: write test for these
test("rhino-attachment-add", async () => {
})

test("rhino-selection-change", async () => {
})

test("rhino-attachment-remove", async () => {
})

test("rhino-file-accept", async () => {
})

