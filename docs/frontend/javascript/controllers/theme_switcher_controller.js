import { Controller } from "@hotwired/stimulus"

function getTheme() {
  return localStorage.getItem('theme') || 'auto';
}

function isDark() {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return theme === 'dark';
}

function setTheme(newTheme) {
  const noTransitions = Object.assign(document.createElement('style'), {
    textContent: '* { transition: none !important; }'
  });

  theme = newTheme;
  localStorage.setItem('theme', theme);

  // Update the UI
  [...document.querySelectorAll('[data-controller~="theme-switcher"]sl-menu-item')].map(item => (item.checked = item.getAttribute('value') === theme));

  // Toggle the dark mode class without transitions
  document.body.appendChild(noTransitions);
  requestAnimationFrame(() => {
    document.documentElement.classList.toggle('sl-theme-dark', isDark());
    requestAnimationFrame(() => document.body.removeChild(noTransitions));
  });
}

export default class ThemeSwitcher extends Controller {
  constructor (...args) {
    super(...args)

    this.handleSelect = (e) => {
      const theme = e.detail?.item?.value
      console.log({theme})

      this.toggleTheme(theme)
    }

    this.handleShortcut = (e) => {
      if (e.key === "\\" && (e.target === document.documentElement || e.target === document.body)) {
        this.toggleTheme()
      }
    }
  }

  connect () {
    this.element.addEventListener("sl-select", this.handleSelect)
    document.addEventListener("keydown", this.handleShortcut)
  }

  disconnect () {
    this.element.removeEventListener("sl-select", this.handleSelect)
    document.removeEventListener("keydown", this.handleShortcut)
  }

  toggleTheme (theme) {
    if (!theme) {
      if (document.body.classList.contains("sl-theme-light")) {
        this.toggleDark()
        return
      }

      if (document.body.classList.contains("sl-theme-dark")) {
        this.toggleLight()
        return
      }
    }

    if (theme === "dark") {
      this.toggleDark()
      return
    }

    if (theme === "light") {
      this.toggleLight()
      return
    }

    // theme === "system"
    this.toggleSystem()
  }

  toggleSystem () {
    this.element.querySelector("[value='light']").checked = false
    this.element.querySelector("[value='dark']").checked = false
    this.element.querySelector("[value='system']").checked = true
  }

  toggleDark () {
    document.body.classList.add("sl-theme-dark")
    document.body.classList.remove("sl-theme-light")

    this.element.querySelector("[value='light']").checked = false
    this.element.querySelector("[value='dark']").checked = true
    this.element.querySelector("[value='system']").checked = false
  }

  toggleLight () {
    document.body.classList.remove("sl-theme-dark")
    document.body.classList.add("sl-theme-light")

    this.element.querySelector("[value='light']").checked = true
    this.element.querySelector("[value='dark']").checked = false
    this.element.querySelector("[value='system']").checked = false
  }
}
