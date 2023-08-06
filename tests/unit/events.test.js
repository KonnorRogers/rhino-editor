// @ts-check
import "rhino-editor"
import { TipTapEditor } from "../../exports/elements/tip-tap-editor.js"
import { fixture, assert, aTimeout, waitUntil } from "@open-wc/testing"
import { html } from "lit"
import { readFile, sendKeys } from '@web/test-runner-commands';
import sinon from "sinon"
import {createDataTransfer} from "./create-data-transfer.js"

/** @type {TipTapEditor} */
let rhinoEditor

/** @type {() => HTMLElement & ElementContentEditable} */
let tiptap

async function createEditor () {
  rhinoEditor = await fixture(html`<rhino-editor></rhino-editor>`)

  // Let it render.
  await aTimeout(1)

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

  assert.equal(called, false)

  await createEditor()

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

  assert.equal(called, false)

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

  tiptap().focus()

  assert.equal(called, false)

  await sendKeys({
    type: "abcd"
  })

  assert.equal(called, true)

  document.removeEventListener("rhino-change", handleEvent)
})

test("rhino-attachment-add", async () => {
  let spy = sinon.spy()

  function handleEvent (e) {
    e.preventDefault()
    spy()
  }

  await createEditor()
  await aTimeout(1)

  rhinoEditor.addEventListener("rhino-attachment-add", handleEvent)
  tiptap().focus()

  assert.equal(spy.calledOnce, false)

  const fileData = await readFile({ path: '../fixtures/view-layer-benchmarks.png' }) || ""
  const dataTransfer = createDataTransfer({
    data: fileData,
    name: "view-layer-benchmarks.png",
    type: "image/png",
  })

  const dropEvent = new DragEvent("drop", { dataTransfer, bubbles: true })

  tiptap().dispatchEvent(dropEvent)

  assert.equal(spy.calledOnce, true)

  rhinoEditor.removeEventListener("rhino-attachment-add", handleEvent)
})

test("rhino-selection-change", async () => {
  let spy = sinon.spy()

  function handleEvent () { spy() }

  document.addEventListener("rhino-selection-change", handleEvent)

  await createEditor()

  tiptap().focus()

  assert.equal(spy.calledOnce, false)

  await sendKeys({ type: "ABCDE" })

  assert.equal(spy.called, true)

  document.removeEventListener("rhino-selection-change", handleEvent)

})

test("rhino-attachment-remove", async () => {
  let spy = sinon.spy()

  function handleAttachment (e) { e.preventDefault() }
  function handleEvent (e) { spy() }

  await createEditor()

  rhinoEditor.addEventListener("rhino-attachment-add", handleAttachment)
  rhinoEditor.addEventListener("rhino-attachment-remove", handleEvent)
  tiptap().focus()


  const fileData = await readFile({ path: '../fixtures/view-layer-benchmarks.png' }) || ""
  const dataTransfer = createDataTransfer({
    data: fileData,
    name: "view-layer-benchmarks.png",
    type: "image/png",
  })

  const dropEvent = new DragEvent("drop", { dataTransfer, bubbles: true })

  tiptap().dispatchEvent(dropEvent)

  assert.equal(spy.calledOnce, false)

  tiptap().querySelector("figure[data-trix-attachment]")?.remove()

  await waitUntil(() => spy.calledOnce)

  // Make sure we dont make additional calls.
  await aTimeout(50)
  assert.equal(spy.calledOnce, true)

  rhinoEditor.removeEventListener("rhino-attachment-add", handleAttachment)
  rhinoEditor.removeEventListener("rhino-attachment-remove", handleEvent)

})

test("rhino-file-accept", async () => {
  let spy = sinon.spy()

  function handleEvent () { spy() }
  function preventAttachment (e) { e.preventDefault() }

  document.addEventListener("rhino-file-accept", handleEvent)
  document.addEventListener("rhino-attachment-add", preventAttachment, { capture: true })

  await createEditor()
  await aTimeout(1)

  tiptap().focus()

  assert.equal(spy.calledOnce, false)

  const fileData = await readFile({ path: '../fixtures/view-layer-benchmarks.png' }) || ""
  const dataTransfer = createDataTransfer({
    data: fileData,
    name: "view-layer-benchmarks.png",
    type: "image/png",
  })

  const dropEvent = new DragEvent("drop", { dataTransfer, bubbles: true })

  tiptap().dispatchEvent(dropEvent)

  assert.equal(spy.calledOnce, true)

  document.removeEventListener("rhino-file-accept", handleEvent)
  document.removeEventListener("rhino-attachment-add", preventAttachment, { capture: true })
})

test("rhino-paste", async () => {
  let spy = sinon.spy()

  function handleEvent () { spy() }

  document.addEventListener("rhino-paste", handleEvent)
  await createEditor()
  await aTimeout(1)

  tiptap().focus()

  assert.equal(spy.calledOnce, false)

  const clipboardData = new DataTransfer()
  clipboardData.setData("text/plain", "abcde")
  const pasteEvent = new ClipboardEvent("paste", { clipboardData, bubbles: true })

  tiptap().dispatchEvent(pasteEvent)

  assert.equal(spy.calledOnce, true)

  document.removeEventListener("rhino-paste", handleEvent)
})

