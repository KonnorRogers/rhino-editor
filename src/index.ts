import { TipTapElement } from "./elements/trix";
import { AttachmentEditor } from "./elements/attachment-editor";
import { AttachmentManager } from "./models/attachment-manager";

window.customElements.define(
  "ash-attachment-editor",
  class extends AttachmentEditor {}
);
window.customElements.define("ash-editor", class extends TipTapElement {});

export {
	AttachmentEditor,
	TipTapElement,
	AttachmentManager
};
