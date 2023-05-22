import { Controller } from "@hotwired/stimulus"
export default class SearchController extends Controller {
  static get targets() {
    return ["container"]
  }

  constructor (...args) {
    super(...args)

    /** @param {KeyboardEvent} e */
    this.handleKeyDown = (e) => {
      if (!(e.target === document.documentElement || e.target === document.body)) {
        return
      }

      if (e.key !== "k") return
      if (e.ctrlKey === false) return

      this.show()
    }
  }

  connect () {
    document.addEventListener("keydown", this.handleKeyDown)
  }

  disconnect () {
    document.removeEventListener("keydown", this.handleKeyDown)
  }

  show() {
    this.containerTarget.removeAttribute("hidden");
    this.containerTarget.querySelector("bridgetown-search-form").querySelector("input").focus()
  }

  hide() {
    this.containerTarget.setAttribute("hidden", "")
  }
}
