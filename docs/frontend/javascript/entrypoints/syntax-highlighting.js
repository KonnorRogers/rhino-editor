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
// On form submission, it will rewrite the value of the hidden input field with the appropriate
// code-highlighting spans from lowlight.
const highlightCodeblocks = (content) => {
  const doc = new DOMParser().parseFromString(content, 'text/html');

  // If it has the "[has-highlighted]" attribute attached, we know it has already been syntax highlighted.
  // This will get stripped from the editor.
  doc.querySelectorAll('pre > code:not([has-highlighted])').forEach((el) => {
    const languageClass = [...el.classList].find(cls => cls.startsWith('language-'));
    const language = languageClass ? languageClass.replace('language-', '') : null;
    const html = language ?
      toHtml(lowlight.highlight(language, el.innerHTML).children) :
      toHtml(lowlight.highlightAuto(el.innerHTML).children);

    el.setAttribute("has-highlighted", "");
    el.innerHTML = html;
  });

  return doc.body.innerHTML;
};

document.addEventListener("submit", (e) => {
  // find all rhino-editor inputs attached to this form and transform them.
  const rhinoInputs = [...e.target.elements].filter((el) => el.classList.contains("rhino-editor-input"))

  rhinoInputs.forEach((inputElement) => {
    inputElement.value = highlightCodeblocks(inputElement.value)
  })
})
