// @ts-check
import { Controller } from "@hotwired/stimulus"

export default class ClipboardController extends Controller {
  connect () {
    this.element.addEventListener("clipboard-copy", this.showSuccess)
    this.element.addEventListener("click", this)
  }

  handleEvent (evt) {
    if (evt.type === "click") {
      this.handleClick(evt)
      return
    }
  }

  handleClick (evt) {
    const el = /** @type {HTMLElement} */ (this.element.getRootNode()).querySelector(`#${this.element.getAttribute("for")}`)
    // Only for <light-code>
    if (el.localName !== "light-code") { return }

    const lightCode = /** @type {import("light-pen/exports/components/light-code/light-code.js").default} */  (el)

    lightCode.code
    navigator.clipboard.writeText(lightCode.code).then(() => {
      this.element.dispatchEvent(new Event("clipboard-copy", { bubbles: true, composed: true, cancelable: false }))
    })
  }

  showSuccess = () => {
    this.element.classList.add("clipboard--success")
    this.element.closest("sl-tooltip").content = "Copied!"
    this.element.classList.remove("clipboard--idle")
    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    this.timeout = setTimeout(() => {
      this.element.closest("sl-tooltip").content = "Copy"
      this.element.classList.remove("clipboard--success")
      this.element.classList.add("clipboard--idle")
    }, 2_000)
  }
}

