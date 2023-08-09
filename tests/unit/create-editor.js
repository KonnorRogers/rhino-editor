// @ts-check
import { fixture, aTimeout } from "@open-wc/testing"

/**
 * @param {import("lit").TemplateResult} html
 */
export async function createEditor (html) {
  /** @type {import("../../exports/elements/tip-tap-editor.js").TipTapEditor} */
  const rhinoEditor = await fixture(html)

  // Let it render.
  await aTimeout(1)

  /** @type {() => HTMLElement & ElementContentEditable} */
  // @ts-expect-error
  const tiptap = () => rhinoEditor.querySelector(".ProseMirror[role='textbox']")

  return { rhinoEditor, tiptap }
}

