// @ts-check
import { fixture, aTimeout } from "@open-wc/testing"
import {html} from "lit"

/**
 * @param {import("lit").TemplateResult} templateResult
 */
export async function createEditor (templateResult = html`<rhino-editor></rhino-editor>`) {
  const el = await fixture(templateResult)

  // let resolver
  // const promise = new Promise((resolve) => {
  //   resolver = resolve
  // })

  // el.addEventListener("rhino-initialize", resolver)
  // await promise
  await el.initializationComplete
  await aTimeout(1)

  /** @type {import("../../../exports/elements/tip-tap-editor.js").TipTapEditor} */
  // @ts-expect-error
  const rhinoEditor = el.querySelector("rhino-editor") || el

  /** @type {() => HTMLElement & ElementContentEditable} */
  // @ts-expect-error
  const tiptap = () => rhinoEditor.querySelector(".ProseMirror[role='textbox']")

  return { rhinoEditor, tiptap }
}

