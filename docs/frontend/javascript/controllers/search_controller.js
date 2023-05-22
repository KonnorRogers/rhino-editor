import { Controller } from "@hotwired/stimulus"
export default class SearchController extends Controller {
  static get targets() {
    return ["container"]
  }

  constructor (...args) {
    super(...args)

    this.isShowing = false

    /** @param {KeyboardEvent} e */
    this.showModal = (e) => {
      if (!(e.target === document.documentElement || e.target === document.body)) {
        return
      }

      if (e.key !== "k") return
      if (e.ctrlKey === false) return

      this.show()
    }

    this.handleBackgroundClick = (e) => {
      if (e.target === this.containerTarget) {
        this.hide()
      }
    }

    this.closeModal = (e) => {
      if (e.key !== "Escape") return

      const searchInput = this.containerTarget.querySelector("input")

      if (searchInput && e.target === searchInput) {
        e.preventDefault()

        if (searchInput.value === "") {
          this.hide()
          return
        }

        // Works around a fun firefox bug.
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1055085
        searchInput.value = ""
        return
      }

      if (this.containerTarget.contains(e.target)) {
        e.preventDefault()
        this.hide()
      }
    }
  }

  connect () {
    document.addEventListener("keydown", this.showModal)
    document.addEventListener("keydown", this.closeModal)
    this.containerTarget.addEventListener("click", this.handleBackgroundClick)
  }

  disconnect () {
    document.removeEventListener("keydown", this.handleKeyDown)
    document.removeEventListener("keydown", this.closeModal)
    this.containerTarget.removeEventListener("click", this.handleBackgroundClick)
  }

  show() {
    this.isShowing = true
    this.containerTarget.removeAttribute("hidden");
    this.containerTarget.querySelector("bridgetown-search-form").querySelector("input").focus()
  }

  hide() {
    this.isShowing = false
    this.containerTarget.setAttribute("hidden", "")
  }
}
