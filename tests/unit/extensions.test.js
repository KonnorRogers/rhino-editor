// @ts-check
import "rhino-editor"
import { fixture, assert, aTimeout, waitUntil } from "@open-wc/testing"
import { html } from "lit"
import { Extension } from "@tiptap/core"

test("Should only add an extension 1 time with array", async () => {
  /** @type {import("rhino-editor").TipTapEditor} */
  const editor = await fixture(html`<rhino-editor></rhino-editor>`)

  const testExtension = Extension.create({
    name: "test-extension"
  })

  editor.addExtensions([
    testExtension
  ])

  await editor.updateComplete
  // not sure why it needs extra wait time
  let extensions = []
  await waitUntil(() => {
    // @ts-expect-error
    extensions = editor.editor?.extensionManager.extensions.filter((ext) => ext.name === "test-extension")
    return extensions?.length
  })

  assert.equal(extensions?.length, 1)
})


test("Should only add an extension 1 time with flat args", async () => {
  /** @type {import("rhino-editor").TipTapEditor} */
  const editor = await fixture(html`<rhino-editor></rhino-editor>`)

  const testExtension = Extension.create({
    name: "test-extension"
  })

  editor.addExtensions(
    testExtension
  )

  await editor.updateComplete
  // not sure why it needs extra wait time
  let extensions = []
  await waitUntil(() => {
    // @ts-expect-error
    extensions = editor.editor?.extensionManager.extensions.filter((ext) => ext.name === "test-extension")
    return extensions?.length
  })
  assert.equal(extensions?.length, 1)
})

