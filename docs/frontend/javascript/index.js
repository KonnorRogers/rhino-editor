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
import "rhino-editor"
import "rhino-editor/exports/styles/trix.css"
import '@github/clipboard-copy-element'
import "./turbo_transitions.js"
import { BridgetownNinjaKeys } from "@konnorr/bridgetown-quick-search/frontend/javascript/ninja-keys.js"
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
    document.body.style.overflow = "hidden"
    document.documentElement.style.overflow = "hidden"
    this.nonModals.forEach((el) => {
      el.setAttribute("inert", "")
    })
    super.open()
  }

  close () {
    super.close()
    document.body.style.overflow = "unset"
    document.documentElement.style.overflow = "unset"
    this.nonModals.forEach((el) => el.removeAttribute("inert"))
  }

  get nonModals () {
    return [...document.body.children].filter((el) => el.localName !== "bridgetown-ninja-keys")
  }
}).define("bridgetown-ninja-keys")

// Uncomment the line below to add transition animations when Turbo navigates.
// We recommend adding <meta name="turbo-cache-control" content="no-preview" />
// to your HTML head if you turn on transitions. Use data-turbo-transition="false"
// on your <main> element for pages where you don't want any transition animation.
//
// import "./turbo_transitions.js"

setBasePath("/shoelace-assets")

// Uncomment the line below to add transition animations when Turbo navigates.
// We recommend adding <meta name="turbo-cache-control" content="no-preview" />
// to your HTML head if you turn on transitions. Use data-turbo-transition="false"
// on your <main> element for pages where you don't want any transition animation.
//
// import "./turbo_transitions.js"

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
