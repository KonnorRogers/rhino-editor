import { Controller } from "@hotwired/stimulus"

export default class ThemeSwitcher extends Controller {
  constructor (...args) {
    super(...args)

    this.handleClick = () => {
      this.toggleTheme()
    }

    this.handleShortcut = (e) => {
      if (e.key === "\\" && (e.target === document.documentElement || e.target === document.body)) {
        this.toggleTheme()
      }
    }
  }

  connect () {
    this.element.addEventListener("click", this.handleClick)
    document.addEventListener("keydown", this.handleShortcut)
  }

  disconnect () {
    document.removeEventListener("keydown", this.handleShortcut)
  }

  toggleTheme () {
    // document.body.classList.toggle("sl-theme-dark")
    // document.body.classList.toggle("sl-theme-light")
    // document.querySelector("#light-theme__icon").toggleAttribute("hidden")
    // document.querySelector("#dark-theme__icon").toggleAttribute("hidden")
  }
}
