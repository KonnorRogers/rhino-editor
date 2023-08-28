// app/javascript/application.js
import "rhino-editor"
import "rhino-editor/exports/styles/trix.css"

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'

// This loads all languages
import { lowlight } from 'lowlight/lib/core'

// load specific languages only
// import { lowlight } from 'lowlight/lib/core'
// import javascript from 'highlight.js/lib/languages/javascript'
// lowlight.registerLanguage('javascript', javascript)

function extendRhinoEditor (event) {
  const rhinoEditor = event.target

  // This is only for documentation, feel free to modify this as needed.
  if (rhinoEditor.getAttribute("id") !== "syntax-highlight-editor") return

  const syntaxHighlight = CodeBlockLowlight.configure({
    lowlight,
  })

  rhinoEditor.starterKitOptions.codeblock = false
  rhinoEditor.addExtensions(syntaxHighlight)
}

document.addEventListener("rhino-before-initialize", extendRhinoEditor)
