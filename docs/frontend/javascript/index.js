import "../styles/index.css"
import { Application } from "@hotwired/stimulus"

// Shoelace
import { setBasePath } from "@shoelace-style/shoelace/dist/utilities/base-path.js";
import "@shoelace-style/shoelace/dist/components/alert/alert.js";
// import "@shoelace-style/shoelace/dist/components/breadcrumb/breadcrumb.js";
// import "@shoelace-style/shoelace/dist/components/breadcrumb-item/breadcrumb-item.js";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "@shoelace-style/shoelace/dist/components/divider/divider.js";
import "@shoelace-style/shoelace/dist/components/drawer/drawer.js";
import "@shoelace-style/shoelace/dist/components/dropdown/dropdown.js";
import "@shoelace-style/shoelace/dist/components/icon/icon.js";
import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
import "@shoelace-style/shoelace/dist/components/menu/menu.js";
import "@shoelace-style/shoelace/dist/components/menu-item/menu-item.js";
import "@shoelace-style/shoelace/dist/components/menu-label/menu-label.js";
import "@shoelace-style/shoelace/dist/components/visually-hidden/visually-hidden.js";

import * as Turbo from "@hotwired/turbo"
window.Turbo = Turbo
import "rhino-editor"
import "rhino-editor/exports/styles/trix.css"
import '@github/clipboard-copy-element'
import { BridgetownNinjaKeys } from "@konnorr/bridgetown-quick-search/ninja-keys.js"
import "./layout.js"

/** @type {import("konnors-ninja-keys").INinjaAction[]} */
const staticData = [
  {
    id: "theme-light",
    icon: "<sl-icon name='sun'></sl-icon>",
    title: "Light Mode",
    section: "Theme",
    keywords: "theme",
    handler () {
      window.applyTheme("light");
    }
  },
  {
    id: "theme-dark",
    icon: "<sl-icon name='moon'></sl-icon>",
    title: "Dark Mode",
    section: "Theme",
    keywords: "theme",
    handler () {
      window.applyTheme("dark");
    }
  },
  {
    id: "theme-system",
    icon: "<sl-icon name='display'></sl-icon>",
    title: "System",
    section: "Theme",
    keywords: "theme",
    handler () {
      window.applyTheme("system");
    }
  },
]

;(class extends BridgetownNinjaKeys {
  constructor (...args) {
    super(...args)
    this.staticData = staticData
    this.openHotkey = super.openHotkey + ",/"
  }

  createData() {
    this.results = this.showResultsForQuery(this._search)

    this.results.forEach((result) => {
      result.icon = `<sl-icon name="link-45deg"></sl-icon>`
    })

    return [
      ...this.staticData,
      ...this.results,
    ]
  }

  open () {
    this.scrollTop = window.scrollY;
    document.body.classList.add('fixed-body');
    // Scroll the wrapper, rather than setting an offset
    // via `top` or `transform`.
    document.body.scroll(0, this.scrollTop);

    this.nonModals.forEach((el) => {
      el.setAttribute("inert", "")
    })
    super.open()
  }

  close () {
    document.body.classList.remove('fixed-body');
    window.scrollTo(0, this.scrollTop);
    super.close()
    this.nonModals.forEach((el) => el.removeAttribute("inert"))
  }

  get nonModals () {
    return [...document.body.children].filter((el) => el.localName !== "bridgetown-ninja-keys")
  }
}).define("bridgetown-ninja-keys")

setBasePath("/shoelace-assets")

// Import all JavaScript & CSS files from src/_components
import components from "bridgetownComponents/**/*.{js,jsx,js.rb,css}"

console.info("Bridgetown is loaded!")

window.Stimulus = Application.start()

import controllers from "./controllers/**/*.{js,js.rb}"
Object.entries(controllers).forEach(([filename, controller]) => {
  if (filename.includes("_controller.") || filename.includes("-controller.")) {
    const identifier = filename.replace("./controllers/", "")
      .replace(/[_-]controller..*$/, "")
      .replace("_", "-")
      .replace("/", "--")

    console.log(filename)
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
    document.querySelectorAll('[data-preserve-scroll').forEach(element => {
      element.scrollTop = scrollPositions[element.id];
    });

    if (event.detail && event.detail.newBody) {
      event.detail.newBody.querySelectorAll('[data-preserve-scroll').forEach(element => {
        element.scrollTop = scrollPositions[element.id];
      });
    }
  }

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
