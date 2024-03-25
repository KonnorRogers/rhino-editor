import "../styles/index.css"
import { Application } from "@hotwired/stimulus"

// Shoelace
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";

import LazyLoader from "./src/lazy-loader.js"

import * as Turbo from "@hotwired/turbo"
window.Turbo = Turbo
import "./src/layout.js"

LazyLoader()

setBasePath("/shoelace-assets")

// Import all JavaScript & CSS files from src/_components
import components from "bridgetownComponents/**/*.{js,jsx,js.rb,css}"

window.Stimulus = Application.start()

import controllers from "./controllers/**/*.{js,js.rb}"
Object.entries(controllers).forEach(([filename, controller]) => {
  if (filename.includes("_controller.") || filename.includes("-controller.")) {
    const identifier = filename.replace("./controllers/", "")
      .replace(/[_-]controller..*$/, "")
      .replace("_", "-")
      .replace("/", "--")

    Stimulus.register(identifier, controller.default)
  }
})

;(() => {
  if (!window.scrollPositions) {
    window.scrollPositions = {};
  }

  function preserveScroll() {
    document.querySelectorAll('[data-preserve-scroll').forEach(element => {
      scrollPositions[element.id] = element.scrollTop;
    });
  }

  function restoreScroll(event) {
    if (event.detail && event.detail.newBody) {
      event.detail.newBody.querySelectorAll('[data-preserve-scroll]').forEach(element => {
        element.scrollTop = scrollPositions[element.id];
      });
    }

    document.querySelectorAll('[data-preserve-scroll').forEach(element => {
      element.scrollTop = scrollPositions[element.id];
    });

  }

  function enhanceCodeBlocks () {
    document.querySelectorAll(":is(.language-bash, .language-shell, .language-zsh, .language-sh, .language-console).highlighter-rouge pre.highlight > code").forEach((el) => {
      if (el.dataset.enhanced === "true") {
        return
      }

      el.dataset.enhanced = "true"

      el.innerHTML = el.innerHTML.split(/\n/).map((str, index, ary) => {
        if (!str && ary.length - 1 === index) return ""
        // return str.replace(/^([])/, "<span class='highlight-command-line-start'>$</span>$1")
        return "<span class='highlight-command-line-start'>$</span>" + str
      }).join("\n").trimEnd()
    })
  }

  document.addEventListener("turbo:load", enhanceCodeBlocks)
  enhanceCodeBlocks()

  window.addEventListener('turbo:before-cache', preserveScroll);
  window.addEventListener('turbo:before-render', restoreScroll);
  window.addEventListener('turbo:render', restoreScroll);
})();

function handleAttachment (event) {
  event.preventDefault()

  let progress = 0

  const attachment = event.attachment
  attachment.setUploadProgress(progress)

  function simulateProgress () {
    if (progress >= 100) {
      progress = 100
      attachment.setUploadProgress(progress)
      return
    }

    window.requestAnimationFrame(() => {
      progress += 1
      attachment.setUploadProgress(progress)
      simulateProgress()
    })
  }

  setTimeout(() => {
    simulateProgress()
  }, 10)
}

document.addEventListener("rhino-attachment-add", handleAttachment, { capture: true })
