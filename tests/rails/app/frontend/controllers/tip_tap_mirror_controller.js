import { Controller } from "@hotwired/stimulus"

export default class TipTapMirrorController extends Controller {
	get trixInput () {
		return document.querySelector(`#${document.querySelector("trix-editor").getAttribute("input")}`)
	}
	connect () {
		const editor = this.element
		setTimeout(() => {
		  replaceWithWrapper(this.trixInput, "value", (_obj, _property, value) => {
			  editor.editor.commands.setContent(value)
		  })
		}, 30)
	}
}


function replaceWithWrapper(obj, property, callback) {
  Object.defineProperty(obj, property, {
    set (value) {
      obj.setAttribute(property, value)
      callback(obj, property, value)
    },
    get: function() {
      return _value;
    }
  });
}
