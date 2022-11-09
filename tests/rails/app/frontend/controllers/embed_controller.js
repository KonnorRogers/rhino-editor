import { Controller } from "@hotwired/stimulus";
import Trix from "trix"
import { AttachmentManager } from "tip-tap-element"

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
  	// const attrs = await this.fetch()
    // let attachment = new Trix.Attachment({ ...attrs })
    // const trix = document.querySelector("trix-editor")
    // trix.editor.insertAttachment(attachment)
    // trix.focus()

		const attrs = await this.fetch()
		let attachment = new AttachmentManager({...attrs})
    const tiptap = document.querySelector("tip-tap-element")
    tiptap.editor.chain().focus().setAttachment(attachment).run();
	}
}
