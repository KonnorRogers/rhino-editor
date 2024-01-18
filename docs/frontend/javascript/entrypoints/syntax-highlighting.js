// app/javascript/application.js
import "rhino-editor/exports/styles/trix.css"

// This loads all languages
import {common, createLowlight} from 'lowlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'

// This will important for storing fully syntax highlighted code.
import {toHtml} from 'hast-util-to-html'

const lowlight = createLowlight(common)

const syntaxHighlight = CodeBlockLowlight.configure({
  lowlight,
})

// load specific languages only
// import { lowlight } from 'lowlight/lib/core'
// import javascript from 'highlight.js/lib/languages/javascript'
// lowlight.register({javascript})

function extendRhinoEditor (event) {
  const rhinoEditor = event.target

  if (rhinoEditor == null) return

  // This is only for documentation site, feel free to modify this as needed.
  if (rhinoEditor.getAttribute("id") !== "syntax-highlight-editor") return

  rhinoEditor.starterKitOptions = {
    ...rhinoEditor.starterKitOptions,
    // We disable codeBlock from the starterkit to be able to use CodeBlockLowlight's extension.
    codeBlock: false
  }

  rhinoEditor.extensions = [syntaxHighlight]

  rhinoEditor.rebuildEditor()
}

document.addEventListener("rhino-before-initialize", extendRhinoEditor)

// This next part is specifically for storing fully syntax highlighted markup in your database.
//
// On form submission, it will rewrite the value of the
const highlightCodeblocks = (content) => {
  const doc = new DOMParser().parseFromString(content, 'text/html');
  // If it has the "[has-highlighted]" attribute attached, we know it has already been syntax highlighted.
  // This will get stripped from the editor.
  doc.querySelectorAll('pre > code[has-highlighted]').forEach((el) => {
    const html = toHtml(lowlight.highlightAuto(el.innerHTML).children)
    el.setAttribute("has-highlighted", "")
    el.innerHTML = html
  });
  let finalStr = doc.body.innerHTML;

  return finalStr
};

document.addEventListener("submit", (e) => {
  // find all rhino-editor inputs attached to this form and transform them.
  const rhinoInputs = [...e.target.elements].filter((el) => el.classList.contains("rhino-editor-input"))

  rhinoInputs.forEach((inputElement) => {
    inputElement.value = highlightCodeblocks(inputElement.value)
  })
})

