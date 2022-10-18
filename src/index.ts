import { TipTapElement } from "./elements/trix";
import { AttachmentEditor } from "./elements/attachment-editor";
import { AttachmentManager } from "./models/attachment-manager";

window.customElements.define(
  "attachment-editor",
  class extends AttachmentEditor {}
);
window.customElements.define("tip-tap-trix", class extends TipTapElement {});

export {
	AttachmentEditor,
	TipTapElement,
	AttachmentManager
};
