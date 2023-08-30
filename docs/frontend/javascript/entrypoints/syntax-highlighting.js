// app/javascript/application.js
import "rhino-editor/exports/styles/trix.css"

// This loads all languages
import { lowlight } from 'lowlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'

// load specific languages only
// import { lowlight } from 'lowlight/lib/core'
// import javascript from 'highlight.js/lib/languages/javascript'
// lowlight.registerLanguage('javascript', javascript)

function extendRhinoEditor (event) {
  const rhinoEditor = event.target

  if (rhinoEditor == null) return

  // This is only for documentation site, feel free to modify this as needed.
  if (rhinoEditor.getAttribute("id") !== "syntax-highlight-editor") return

  const syntaxHighlight = CodeBlockLowlight.configure({
    lowlight,
  })

  rhinoEditor.starterKitOptions = {
    ...rhinoEditor.starterKitOptions,
    // We disable codeBlock from the starterkit to be able to use CodeBlockLowlight's extension.
    codeBlock: false
  }

  rhinoEditor.extensions = [syntaxHighlight]

  rhinoEditor.rebuildEditor()
}

// Because this script is lazy loaded in the docs, we miss out on the `rhino-before-initialize` event.
// In your app you should be able to do:
// document.addEventListener("rhino-before-initialize", extendRhinoEditor)
document.addEventListener("rhino-initialize", extendRhinoEditor)
