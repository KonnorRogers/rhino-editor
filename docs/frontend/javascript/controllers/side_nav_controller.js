import { Controller } from "@hotwired/stimulus"

export default class SideNavController extends Controller {
  open() {
    this.drawer.show()
  }

  close() {
    this.drawer.hide()
  }

  toggle() {
    if (this.drawer.open) {
      this.open()
    } else {
      this.close()
    }
  }

  get drawer() {
    return document.querySelector("#side-nav-drawer")
  }
}
