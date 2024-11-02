import { Controller } from "@hotwired/stimulus";
import Trix from "trix"
import { AttachmentManager } from "rhino-editor"

export default class EmbedController extends Controller {
	connect () {
		this.element.addEventListener("click", this.attach)
	}

	disconnect () {
		this.element.removeEventListener("click", this.attach)
	}

	get attach () {
		if (this._attach != null) return this._attach

		this._attach = {
			handleEvent: (_e) => {
				this.embed()
			}
		}

		return this._attach
	}

	async fetch () {
    const resp = await window.fetch("/youtube/1", {
      method: 'get'
    })

		const json = await resp.json()
    return json
  }

  async embed() {
    const isRhino = this.element.closest("rhino-editor")
    const isTrix = this.element.parentElement.querySelector("trix-editor")
    const attrs = await this.fetch()

    if (isTrix) {
    	let trixAttachment = new Trix.Attachment({ ...attrs })
    	const trix = document.querySelector("trix-editor")
    	trix.editor.insertAttachment(trixAttachment)
    	trix.focus()
    }

    if (isRhino) {
    	let attachment = new AttachmentManager({...attrs})
    	const tiptap = document.querySelector("rhino-editor")
    	tiptap.editor.chain().focus().setAttachment(attachment).run();
    }
  }
}
