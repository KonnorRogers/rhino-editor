import { TipTapElement } from "./tip-tap-element/element"
import { AttachmentEditor } from "./tip-tap-element/attachment-editor"
export { AttachmentEditor, TipTapElement }

window.customElements.define("attachment-editor", class extends AttachmentEditor{})
window.customElements.define("tip-tap-trix", class extends TipTapElement{})

console.log("hi")
