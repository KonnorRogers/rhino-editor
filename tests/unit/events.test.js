// @ts-check
import "rhino-editor"
import { TipTapEditor } from "../../exports/elements/tip-tap-editor.js"
import { fixture, assert } from "@open-wc/testing"
import { html } from "lit"
// import { sendKeys } from '@web/test-runner-commands';

/** @type {TipTapEditor} */
let rhinoEditor

/** @type {HTMLOrSVGElement & ElementContentEditable} */
let tiptap

setup(async () => {
  rhinoEditor = await fixture(html`<rhino-editor></rhino-editor>`)

  /** @type {HTMLDivElement & ElementContentEditable} */
  // @ts-expect-error
  tiptap = rhinoEditor.querySelector(".ProseMirror[role='textbox']")
})

// "rhino-attachment-add" and "rhino-attachment-remove" are handled in the Rails attachment tests
// due to it requiring an actual attachment
test("rhino-attachment-add", async () => {
})
test("rhino-file-accept", async () => {
})
test("rhino-attachment-remove", async () => {
})

test("rhino-before-initialize", async () => {
})
test("rhino-initialize", async () => {
})
test("rhino-blur", async () => {
})
test("rhino-change", async () => {
})
test("rhino-focus", async () => {
})
test("rhino-paste", async () => {
})
test("rhino-selection-change", async () => {
})
