// @ts-check
import "rhino-editor"
import { assert, aTimeout, fixture, waitUntil } from "@open-wc/testing"
import { html } from "lit"
import { readFile, sendKeys } from '@web/test-runner-commands';
import sinon from "sinon"
import {createDataTransfer} from "./helpers/create-data-transfer.js"
import { createEditor } from "./helpers/create-editor.js";

const editorHTML = html`<rhino-editor></rhino-editor>`

test("rhino-before-initialize", async () => {
  let called = false

  function handleEvent () {
    called = true
  }

  document.addEventListener("rhino-before-initialize", handleEvent)
  await createEditor(editorHTML)

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

  await createEditor(editorHTML)

  assert.equal(called, true)

  document.removeEventListener("rhino-initialize", handleEvent)
})
test("rhino-focus", async () => {
  let called = false

  function handleEvent () {
    called = true
  }

  document.addEventListener("rhino-focus", handleEvent)
  const { tiptap } = await createEditor(editorHTML)

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
  const { tiptap } = await createEditor(editorHTML)
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

  const { tiptap } = await createEditor(editorHTML)

  document.addEventListener("rhino-change", handleEvent)

  tiptap().focus()

  assert.equal(called, false)

  tiptap().focus()

  await sendKeys({
    type: "abcd"
  })

  await waitUntil(() => called === true)
  assert.equal(called, true)

  document.removeEventListener("rhino-change", handleEvent)
})

test("rhino-attachment-add", async () => {
  let spy = sinon.spy()

  function handleEvent (e) {
    e.preventDefault()
    spy()
  }

  const { rhinoEditor, tiptap } = await createEditor(editorHTML)

  rhinoEditor.addEventListener("rhino-attachment-add", handleEvent)
  tiptap().click()
  tiptap().focus()

  assert.equal(spy.calledOnce, false)

  const fileData = await readFile({ path: '../fixtures/view-layer-benchmarks.png' }) || ""
  const dataTransfer = createDataTransfer({
    data: fileData,
    name: "view-layer-benchmarks.png",
    type: "image/png",
  })

  const dropEvent = new DragEvent("drop", { dataTransfer, bubbles: true, cancelable: true, composed: true })

  rhinoEditor.dispatchEvent(dropEvent)

  await waitUntil(() => spy.calledOnce === true)
  assert.equal(spy.calledOnce, true)

  rhinoEditor.removeEventListener("rhino-attachment-add", handleEvent)
})

test("rhino-selection-change", async () => {
  let spy = sinon.spy()

  function handleEvent () { spy() }

  document.addEventListener("rhino-selection-change", handleEvent)

  const { tiptap } = await createEditor(editorHTML)

  tiptap().focus()

  assert.equal(spy.calledOnce, false)

  await sendKeys({ type: "ABCDE" })

  assert.equal(spy.called, true)

  document.removeEventListener("rhino-selection-change", handleEvent)

})

test("rhino-attachment-remove", async () => {
  let spy = sinon.spy()

  function handleAttachment (e) { e.preventDefault() }
  function handleEvent (e) {
    spy()
  }

  const { rhinoEditor, tiptap } = await createEditor(editorHTML)

  rhinoEditor.addEventListener("rhino-attachment-add", handleAttachment)
  rhinoEditor.addEventListener("rhino-attachment-remove", handleEvent)
  tiptap().focus()

  const fileData = await readFile({ path: '../fixtures/view-layer-benchmarks.png' }) || ""
  const dataTransfer = createDataTransfer({
    data: fileData,
    name: "view-layer-benchmarks.png",
    type: "image/png",
  })

  const dropEvent = new DragEvent("drop", { dataTransfer, bubbles: true, cancelable: true, composed: true })

  rhinoEditor.dispatchEvent(dropEvent)

  assert.equal(spy.calledOnce, false)

  const attachmentEditor = () => tiptap().querySelector("figure > rhino-attachment-editor")
  await waitUntil(() => attachmentEditor())

  attachmentEditor().removeFigure()

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

  const { tiptap } = await createEditor(editorHTML)

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
  const { tiptap } = await createEditor(editorHTML)

  tiptap().focus()

  assert.equal(spy.calledOnce, false)

  const clipboardData = new DataTransfer()
  clipboardData.setData("text/plain", "abcde")
  const pasteEvent = new ClipboardEvent("paste", { clipboardData, bubbles: true })

  tiptap().dispatchEvent(pasteEvent)

  assert.equal(spy.calledOnce, true)

  document.removeEventListener("rhino-paste", handleEvent)
})

test("Should not fire initialize and before-initialize events until after defer-initialize is removed", async () => {
  const beforeInitializeSpy = sinon.spy()
  const initializeSpy = sinon.spy()

  function handleBeforeInitialize () { beforeInitializeSpy() }
  function handleInitialize () { initializeSpy() }

  document.addEventListener("rhino-before-initialize", handleBeforeInitialize)
  document.addEventListener("rhino-initialize", handleInitialize)

  const rhinoEditor = await fixture(html`<rhino-editor defer-initialize></rhino-editor>`)

  await rhinoEditor.updateComplete
  await aTimeout(10)

  assert.isTrue(beforeInitializeSpy.notCalled)
  assert.isTrue(initializeSpy.notCalled)

  rhinoEditor.removeAttribute("defer-initialize")
  await rhinoEditor.updateComplete
  await aTimeout(10)

  assert.isTrue(beforeInitializeSpy.calledOnce)
  assert.isTrue(initializeSpy.calledOnce)

  document.removeEventListener("rhino-before-initialize", handleBeforeInitialize)
  document.removeEventListener("rhino-initialize", handleInitialize)
})
