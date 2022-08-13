import "@hotwired/turbo"
import * as ActiveStorage from '@rails/activestorage'
import "@rails/actiontext"
import "trix"
import "trix/dist/trix.css"
import { TipTapElement } from "tip-tap-element"

window.customElements.define("tip-tap-element", TipTapElement)
console.log('Vite ⚡️ Rails')

ActiveStorage.start()
addEventListener("trix-attachment-add", (e) => {
  console.log(e)
})

// Import all channels.
// const channels = import.meta.globEager('./**/*_channel.js')

;(async function () {
  const Prism = (await import("https://cdn.skypack.dev/prismjs")).default
  await window.customElements.whenDefined("tip-tap-element");

  const tipTapInput = document.querySelector("#y")
  const tipTapHtmlMirror = document.querySelector("#tip-tap-mirrored-html")

  const trixInput = document.querySelector("#x")
  const trixHtmlMirror = document.querySelector("#trix-mirrored-html")

  Prism.highlightElement(trixHtmlMirror)
  Prism.highlightElement(tipTapHtmlMirror)

  const escapeHTML = (str) => {
    const p = document.createElement("p");
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
  }

  replaceWithWrapper(tipTapInput, "value", function(obj, property, value) {
    const html = escapeHTML(value.replace(/<p>/g, "\n<p>").replace(/<blockquote>/g, "\n<blockquote>").replace(/<\/blockquote>/g, "\n</blockquote>"))

    tipTapHtmlMirror.innerHTML = html
    Prism.highlightElement(tipTapHtmlMirror)
    obj.setAttribute(property, value)
  });

  replaceWithWrapper(trixInput, "value", function(obj, property, value) {
    const html = escapeHTML(value.replace(/<p>/g, "\n<p>").replace(/<blockquote>/g, "\n<blockquote>").replace(/<\/blockquote>/g, "\n</blockquote>"))

    trixHtmlMirror.innerHTML = html
    Prism.highlightElement(trixHtmlMirror)
    obj.setAttribute(property, value)
  });

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
