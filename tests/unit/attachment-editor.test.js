// @ts-check
import { assert, elementUpdated, fixture } from "@open-wc/testing";
import { html } from "lit";
import { AttachmentEditor } from "rhino-editor/exports/elements/attachment-editor.js";

AttachmentEditor.define();

async function renderAttachmentEditor() {
  const editor = await fixture(
    html`<rhino-attachment-editor></rhino-attachment-editor>`,
  );
  editor.altTextEditor = true;
  editor.requestUpdate();
  await elementUpdated(editor);
  return editor;
}

test("Alt text dialog close button has an accessible name", async () => {
  const editor = await renderAttachmentEditor();
  const closeButton = editor.shadowRoot.querySelector(
    "[part~='dialog-close-button']",
  );

  assert.equal(closeButton?.getAttribute("aria-label"), "Close dialog");
});

test("Alt text save button exposes valid aria-disabled states", async () => {
  const editor = await renderAttachmentEditor();
  const saveButton = () =>
    editor.shadowRoot.querySelector("[part~='alt-text-save-button']");

  assert.equal(saveButton()?.getAttribute("aria-disabled"), "true");

  editor.editorValue = "A useful description";
  await elementUpdated(editor);

  assert.equal(saveButton()?.getAttribute("aria-disabled"), "false");
});
