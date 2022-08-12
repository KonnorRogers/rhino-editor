import { TipTapElement } from "./elements/trix"
import { AttachmentEditor } from "./elements/attachment-editor"

window.customElements.define("attachment-editor", class extends AttachmentEditor{})
window.customElements.define("tip-tap-trix", class extends TipTapElement{})

export { AttachmentEditor, TipTapElement }
