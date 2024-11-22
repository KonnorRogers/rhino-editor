import { Controller } from "@hotwired/stimulus"

export default class TipTapMirrorController extends Controller {
  get trixInput () {
	  return document.querySelector("trix-editor")
  }
  connect () {
    this.trixInput?.addEventListener("trix-change", this.handleChange)

  }

  disconnect () {
    this.trixInput?.removeEventListener("trix-change", this.handleChange)
  }



  handleChange = () => {
    const editor = this.element
    const value = this.trixInput.value
    editor.editor.commands.setContent(value)
  }
}


