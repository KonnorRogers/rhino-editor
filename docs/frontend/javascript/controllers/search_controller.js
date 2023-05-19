import { Controller } from "@hotwired/stimulus"
export default class SearchController extends Controller {
  static get targets() {
    return ["container"]
  }

  show() {
    this.containerTarget.removeAttribute("hidden");
    this.containerTarget.querySelector("bridgetown-search-form").querySelector("input").focus()
  }

  hide() {
    this.containerTarget.setAttribute("hidden", "")
  }
}
