// app/javascript/application.js
import "rhino-editor/exports/styles/trix.css"

// This loads all languages
import {common, createLowlight} from 'lowlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'

// This will important for storing fully syntax highlighted code.
import he from 'he'
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

  const form = rhinoEditor.closest('form')
  if (form) {
    preProcessRhinoFormInputs(form)
  }

  rhinoEditor.starterKitOptions = {
    ...rhinoEditor.starterKitOptions,
    // We disable codeBlock from the starterkit to be able to use CodeBlockLowlight's extension.
    codeBlock: false
  }

  rhinoEditor.extensions = [syntaxHighlight]

  rhinoEditor.rebuildEditor()
}

document.addEventListener("rhino-before-initialize", extendRhinoEditor, { once: true })

function preProcessRhinoFormInputs(form) {
  const rhinoInputs = [...form.elements].filter((el) => el.classList.contains("rhino-editor-input"))
  rhinoInputs.forEach((inputElement) => {
    inputElement.value = stripHljsSpans(inputElement.value)
  })
}

// When editing existing code blocks, strip the highlighting spans that wrap the code
// blocks. This allows CodeBlockLowlight to then properly re-parse the code blocks
// for highlighting. Without this, the spans do appear in the editor's highlighted
// code blocks, but some newlines are missing. The missing newlines will be
// when they are at the end of a line with only whitespace after them. Those
// newlines get lost in processing if these spans are not first stripped.
function stripHljsSpans(content) {
  const tempDoc = new DOMParser().parseFromString(content, 'text/html')

  tempDoc.querySelectorAll('pre > code').forEach(codeEl => {
    const spans = codeEl.querySelectorAll('span[class^="hljs-"]')

    spans.forEach(span => {
      const textNode = document.createTextNode(span.textContent)
      span.parentNode.replaceChild(textNode, span)
    })
  })

  return tempDoc.body.innerHTML
}


// This next part is specifically for storing fully syntax highlighted markup in your database.
//
// On form submission, it will rewrite the value of the hidden input field with the appropriate
// code-highlighting spans from lowlight.
const highlightCodeblocks = (content) => {
  const doc = new DOMParser().parseFromString(content, 'text/html');

  doc.querySelectorAll('pre > code').forEach((el) => {
    const languageClass = [...el.classList].find(cls => cls.startsWith('language-'));
    const language = languageClass ? languageClass.replace('language-', '') : null;

    // Decode the content before re-parsing so that we do not double-encode any HTML entities.
    const decodedContent = he.decode(el.innerHTML)
    const html = language ?
      toHtml(lowlight.highlight(language, decodedContent).children) :
      toHtml(lowlight.highlightAuto(decodedContent).children);

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
