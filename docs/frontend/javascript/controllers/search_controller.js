import { Controller } from "@hotwired/stimulus"
export default class SearchController extends Controller {
  static get targets() {
    return ["container"]
  }

  show() {
    this.containerTarget.removeAttribute("hidden");
  }

  hide() {
    this.containerTarget.setAttribute("hidden", "")
  }
}
