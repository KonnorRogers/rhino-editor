// @ts-check
import { TipTapEditor } from "../../exports/elements/tip-tap-editor.js"
import { fixture, assert } from "@open-wc/testing"
import { html } from "lit"

test("Should not render against a destroyed editor after disconnecting", async () => {
  /** @type {TipTapEditor} */
  const rhino = await fixture(html`<rhino-editor></rhino-editor>`)

  TipTapEditor.define()
  await rhino.initializationComplete

  rhino.starterKitOptions = { ...rhino.starterKitOptions, rhinoLink: false }
  rhino.rebuildEditor()
  await rhino.updateComplete

  rhino.requestUpdate()
  rhino.remove()

  await rhino.updateComplete
  assert.isFalse(Boolean(rhino.editor), "a disconnected element should not keep its destroyed editor")
})

test("Should rebuild a working editor when reconnected", async () => {
  /** @type {TipTapEditor} */
  const rhino = await fixture(html`<rhino-editor></rhino-editor>`)

  TipTapEditor.define()
  await rhino.initializationComplete

  const parent = /** @type {HTMLElement} */ (rhino.parentElement)
  rhino.remove()
  parent.append(rhino)
  await rhino.initializationComplete

  assert.ok(rhino.editor)
  assert.notOk(rhino.editor?.isDestroyed)
  assert.equal(rhino.querySelectorAll("[role='textbox']").length, 1)
})
