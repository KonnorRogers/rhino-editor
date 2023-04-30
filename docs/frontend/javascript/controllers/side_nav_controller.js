import { Controller } from "@hotwired/stimulus"

export default class SideNavController extends Controller {
  async open() {
    this.drawer.removeAttribute("hidden")
    await this.drawer.show()
  }

  async close() {
    await this.drawer.hide()
    setTimeout(() => this.drawer.setAttribute("hidden", ""))
  }

  async toggle() {
    if (this.drawer.open) {
      await this.open()
    } else {
      await this.close()
    }
  }

  get drawer() {
    return document.querySelector("#side-nav-drawer")
  }
}

