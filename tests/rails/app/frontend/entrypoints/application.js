import "@hotwired/turbo"
import * as ActiveStorage from '@rails/activestorage'
import "@rails/actiontext"
import * as Trix from "trix"
import "rhino-editor"
import "trix/dist/trix.css";
import "rhino-editor/exports/styles/trix.css";
import { Application } from "@hotwired/stimulus"
import EmbedController from "../controllers/embed_controller.js"
import TipTapMirrorController from "../controllers/tip_tap_mirror_controller.js"
window.Stimulus = Application.start()
window.Stimulus.debug = true
Stimulus.register("embed", EmbedController)
Stimulus.register("tip-tap-mirror", TipTapMirrorController)

ActiveStorage.start()
// addEventListener("trix-attachment-add", (e) => {
//   console.log(e)
// })


// Import all channels.
// const channels = import.meta.globEager('./**/*_channel.js')

;(async function () {
  const Prism = (await import("https://cdn.skypack.dev/prismjs")).default
  await window.customElements.whenDefined("rhino-editor");

  const tipTapInput = document.querySelector("#y")
  const tipTapHtmlMirror = document.querySelector("#tip-tap-mirrored-html")

  const trixInput = document.querySelector("#x")
  const trixHtmlMirror = document.querySelector("#trix-mirrored-html")

  if (trixHtmlMirror) Prism.highlightElement(trixHtmlMirror)
  if (tipTapHtmlMirror) Prism.highlightElement(tipTapHtmlMirror)

  const escapeHTML = (str) => {
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
  }

  if (tipTapInput && tipTapHtmlMirror) {
    replaceWithWrapper(tipTapInput, "value", function(obj, property, value) {
      const html = escapeHTML(value.replace(/<p>/g, "\n<p>").replace(/<blockquote>/g, "\n<blockquote>").replace(/<\/blockquote>/g, "\n</blockquote>"))

      tipTapHtmlMirror.innerHTML = html
      Prism.highlightElement(tipTapHtmlMirror)
      obj.setAttribute(property, value)
    });
  }

  if (trixInput && trixHtmlMirror) {
    replaceWithWrapper(trixInput, "value", function(obj, property, value) {
      const html = escapeHTML(value.replace(/<p>/g, "\n<p>").replace(/<blockquote>/g, "\n<blockquote>").replace(/<\/blockquote>/g, "\n</blockquote>"))

      trixHtmlMirror.innerHTML = html
      Prism.highlightElement(trixHtmlMirror)
      obj.setAttribute(property, value)
    });
  }

  function replaceWithWrapper(obj, property, callback) {
    Object.defineProperty(obj, property, new function() {
      var _value = obj[property];
      return {
        set: function(value) {
          _value = value;
          callback(obj, property, value)
        },
        get: function() {
          return _value;
        }
      }
    });
  }
})()
