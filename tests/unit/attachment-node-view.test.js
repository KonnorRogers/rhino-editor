// @ts-check
import "rhino-editor"
import { assert, aTimeout, fixture, waitUntil } from "@open-wc/testing"
import { html } from "lit"
import { sendKeys, sendMouse, resetMouse } from "@web/test-runner-commands"
import { findChildren } from "@tiptap/core"
import { AttachmentManager } from "rhino-editor/exports/attachment-manager.js"

/**
 * @param {string} sgid
 * @param {string} url
 */
function trixFigure (sgid, url = "/tests/fixtures/screenshot-1.png") {
  const attachment = JSON.stringify({
    contentType: "image/png",
    filename: `${sgid}.png`,
    filesize: 100,
    sgid,
    url,
  })

  return `<figure data-trix-attachment='${attachment}' data-trix-attributes='{"presentation":"gallery"}'></figure>`
}

/**
 * @param {string[]} sgids
 */
function gallery (...sgids) {
  return `<div class="attachment-gallery">${sgids.map((sgid) => trixFigure(sgid)).join("")}</div>`
}

/**
 * @param {string} content
 */
async function createEditorWithContent (content) {
  const div = await fixture(html`<div>
    <style>rhino-editor img { width: 80px; height: 40px; }</style>
    <input id="input" type="hidden" value=${content}>
    <rhino-editor input="input"></rhino-editor>
  </div>`)

  /** @type {import("../../exports/elements/tip-tap-editor.js").TipTapEditor} */
  // @ts-expect-error
  const rhinoEditor = div.querySelector("rhino-editor")
  await rhinoEditor.initializationComplete
  await aTimeout(1)

  const editor = rhinoEditor.editor
  if (!editor) throw Error("Editor did not initialize")

  return editor
}

/**
 * @param {import("@tiptap/core").Editor} editor
 * @param {string} sgid
 */
function findAttachment (editor, sgid) {
  const [result] = findChildren(editor.state.doc, (node) => node.attrs.sgid === sgid)
  if (!result) throw Error(`No attachment with sgid ${sgid}`)
  return result
}

/**
 * @param {import("@tiptap/core").Editor} editor
 * @param {string} sgid
 */
function findFigure (editor, sgid) {
  const figure = editor.view.dom.querySelector(`figure[sgid='${sgid}']`)
  if (!figure) throw Error(`No figure with sgid ${sgid}`)
  return figure
}

/**
 * @param {import("@tiptap/core").Editor} editor
 * @param {string} sgid
 */
function findImage (editor, sgid) {
  return findFigure(editor, sgid).querySelector("img")
}

/**
 * @param {import("@tiptap/core").Editor} editor
 * @param {string} sgid
 */
function findAttachmentEditor (editor, sgid) {
  const attachmentEditor = /** @type {import("../../exports/elements/attachment-editor.js").AttachmentEditor | null} */ (
    findFigure(editor, sgid).querySelector("rhino-attachment-editor")
  )
  if (!attachmentEditor) throw Error(`No attachment editor with sgid ${sgid}`)
  return attachmentEditor
}

/**
 * @param {import("@tiptap/core").Editor} editor
 * @param {string} sgid
 */
async function placeCaretInCaption (editor, sgid) {
  const { node, pos } = findAttachment(editor, sgid)
  editor.chain().focus().setTextSelection(pos + 1 + node.content.size).run()
  await aTimeout(20)
}

/**
 * @param {import("@tiptap/core").Editor} editor
 */
async function placeCaretAtEnd (editor) {
  editor.chain().focus("end").run()
  await aTimeout(20)
}

/**
 * @param {import("@tiptap/core").Editor} editor
 * @param {Array<string | string[]>} expected
 */
function assertLayout (editor, expected) {
  /** @type {Array<string | string[]>} */
  const documentLayout = []

  editor.state.doc.forEach((node) => {
    if (node.type.name === "attachment-gallery") {
      /** @type {string[]} */
      const sgids = []
      node.forEach((child) => sgids.push(child.attrs.sgid))
      documentLayout.push(sgids)
    } else {
      documentLayout.push(node.attrs.sgid || node.type.name)
    }
  })

  const domLayout = [...editor.view.dom.children].map((element) => {
    if (element.classList.contains("attachment-gallery")) {
      return [...element.querySelectorAll("figure")].map((figure) => figure.getAttribute("sgid") || "")
    }

    return element.getAttribute("sgid") || (element.tagName === "P" ? "paragraph" : element.tagName)
  })

  assert.deepEqual(documentLayout, expected)
  assert.deepEqual(domLayout, expected)
}

/**
 * @param {import("@tiptap/core").Editor} editor
 */
async function imagesLoaded (editor) {
  await Promise.all(
    [...editor.view.dom.querySelectorAll("img")].map((img) => img.decode().catch(() => {}))
  )
}

/**
 * @param {Element} element
 * @returns {[number, number]}
 */
function center (element) {
  const rect = element.getBoundingClientRect()
  return [Math.round(rect.left + rect.width / 2), Math.round(rect.top + rect.height / 2)]
}

/**
 * @param {Element} figure
 * @param {Element} target
 */
async function dragFigure (figure, target) {
  const image = figure.querySelector("img")
  if (!image) throw Error("No image to drag")

  const start = center(image)
  const { left, top } = target.getBoundingClientRect()
  const end = [Math.round(left + 4), Math.round(top + 4)]

  await sendMouse({ type: "move", position: start })
  await sendMouse({ type: "down" })
  await aTimeout(50)
  for (let step = 1; step <= 5; step++) {
    await sendMouse({
      type: "move",
      position: [
        Math.round(start[0] + (end[0] - start[0]) * step / 5),
        Math.round(start[1] + (end[1] - start[1]) * step / 5),
      ],
    })
  }
  await sendMouse({ type: "up" })
  await resetMouse()
  await aTimeout(50)
}

test("Typing in one gallery caption keeps the other <img> elements", async () => {
  const editor = await createEditorWithContent(`${gallery("a", "b", "c")}<p>After</p>`)

  await placeCaretAtEnd(editor)

  const images = ["a", "b", "c"].map((sgid) => findImage(editor, sgid))

  await placeCaretInCaption(editor, "b")
  await sendKeys({ type: "Hello" })

  assert.include(findAttachment(editor, "b").node.textContent, "Hello")
  assert.deepEqual(["a", "b", "c"].map((sgid) => findImage(editor, sgid)), images)
})

test("Changing alt text after editing a caption keeps the caption", async () => {
  const editor = await createEditorWithContent(`${gallery("a")}<p>After</p>`)

  findAttachmentEditor(editor, "a").setNodeAttributes({ alt: "First alt" })

  await placeCaretInCaption(editor, "a")
  await sendKeys({ type: "Hello" })

  findAttachmentEditor(editor, "a").setNodeAttributes({ alt: "Second alt" })
  findAttachmentEditor(editor, "a").setNodeAttributes({ altTextDialogOpen: false })
  await aTimeout(1)

  const { node } = findAttachment(editor, "a")
  assert.equal(node.textContent, "Hello")
  assert.equal(node.attrs.caption, "Hello")
  assert.equal(node.attrs.alt, "Second alt")
  assert.equal(findImage(editor, "a")?.getAttribute("alt"), "Second alt")
})

test("Dragging an image out of a gallery moves it", async () => {
  const editor = await createEditorWithContent(`${gallery("a", "b")}<p>One</p><p>Two</p>`)
  await imagesLoaded(editor)

  await dragFigure(findFigure(editor, "a"), editor.view.dom.querySelectorAll("p")[1])

  assertLayout(editor, [["b"], "paragraph", "a", "paragraph"])
})

test("Dragging an image within a gallery moves it", async () => {
  const editor = await createEditorWithContent(`${gallery("a", "b", "c")}<p>After</p>`)
  await imagesLoaded(editor)

  await dragFigure(findFigure(editor, "a"), findFigure(editor, "c"))

  assertLayout(editor, [["b", "a", "c"], "paragraph"])
})

test("Dragging an image between galleries moves it", async () => {
  const editor = await createEditorWithContent(`${gallery("a", "b")}<p>Between</p>${gallery("c")}<p>After</p>`)
  await imagesLoaded(editor)

  await dragFigure(findFigure(editor, "a"), findFigure(editor, "c"))

  assertLayout(editor, [["b"], "paragraph", ["a", "c"], "paragraph"])
})

test("An uploading image switches to its uploaded URL and is then kept", async () => {
  const editor = await createEditorWithContent("<p></p>")

  const blob = await (await fetch("/tests/fixtures/screenshot-1.png")).blob()
  const src = URL.createObjectURL(blob)
  const attachment = new AttachmentManager({
    src,
    contentType: "image/png",
    fileName: "screenshot-1.png",
    fileSize: blob.size,
  }, editor.view)

  editor.commands.setAttachment(attachment)
  await aTimeout(1)

  const image = () => editor.view.dom.querySelector("figure img")
  assert.equal(image()?.getAttribute("src"), src)

  attachment.setAttributes({ sgid: "uploaded", url: "/tests/fixtures/screenshot-2.png" })
  await waitUntil(() => image()?.getAttribute("src") === "/tests/fixtures/screenshot-2.png")

  const img = findImage(editor, "uploaded")
  const attachmentEditor = findAttachmentEditor(editor, "uploaded")
  assert.equal(attachmentEditor.getAttribute("loading-state"), "success")
  assert.equal(attachmentEditor.getAttribute("progress"), "100")

  await placeCaretInCaption(editor, "uploaded")
  await sendKeys({ type: "Hello" })

  assert.include(findAttachment(editor, "uploaded").node.textContent, "Hello")
  assert.strictEqual(findImage(editor, "uploaded"), img)
})

test("Replacing a selected image with text renders a paragraph", async () => {
  const editor = await createEditorWithContent(`<p>Before</p>${trixFigure("a")}<p>After</p>`)

  assertLayout(editor, ["paragraph", "a", "paragraph"])

  editor.chain().setNodeSelection(findAttachment(editor, "a").pos).insertContent("x").run()

  assertLayout(editor, ["paragraph", "paragraph", "paragraph"])
})

/** @type {Record<string, (editor: import("@tiptap/core").Editor) => Promise<void>>} */
const interactions = {
  "typing in its caption": async (editor) => {
    await placeCaretInCaption(editor, "a")
    await sendKeys({ type: "Hello" })
    assert.include(findAttachment(editor, "a").node.textContent, "Hello")
  },
  "moving the caret into and out of its caption": async (editor) => {
    await placeCaretInCaption(editor, "a")
    assert.isTrue(findFigure(editor, "a").classList.contains("has-focus"))
    await placeCaretAtEnd(editor)
    assert.isFalse(findFigure(editor, "a").classList.contains("has-focus"))
    await placeCaretInCaption(editor, "a")
  },
  "clicking it": async (editor) => {
    const image = findImage(editor, "a")
    if (!image) throw Error("No image to click")
    await sendMouse({ type: "click", position: center(image) })
    await resetMouse()
  },
  "changing its alt text": async (editor) => {
    findAttachmentEditor(editor, "a").setNodeAttributes({ alt: "A screenshot" })
    assert.equal(findImage(editor, "a")?.getAttribute("alt"), "A screenshot")
  },
  "typing in another paragraph": async (editor) => {
    await placeCaretAtEnd(editor)
    await sendKeys({ type: "Hello" })
  },
}

for (const [name, interact] of Object.entries(interactions)) {
  test(`An uploaded image is kept and its URL is not requested again after ${name}`, async () => {
    performance.clearResourceTimings()

    const url = `/tests/fixtures/missing-${Math.random()}.png`
    const requests = () => performance.getEntriesByType("resource").filter((entry) => entry.name.endsWith(url)).length

    const editor = await createEditorWithContent(
      `<div class="attachment-gallery">${trixFigure("a", url)}</div><p>After</p>`
    )
    await placeCaretAtEnd(editor)
    await aTimeout(100)

    const img = findImage(editor, "a")
    const before = requests()
    assert.isAbove(before, 0)

    await interact(editor)
    await aTimeout(200)

    assert.strictEqual(findImage(editor, "a"), img)
    assert.equal(requests(), before)
  })
}
