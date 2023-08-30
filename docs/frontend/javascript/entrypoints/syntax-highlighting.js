// app/javascript/application.js
import "rhino-editor/exports/styles/trix.css"

// This loads all languages
import { lowlight } from 'lowlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { TipTapEditor } from "rhino-editor"

// load specific languages only
// import { lowlight } from 'lowlight/lib/core'
// import javascript from 'highlight.js/lib/languages/javascript'
// lowlight.registerLanguage('javascript', javascript)

// function extendRhinoEditor (event) {
//   const rhinoEditor = event.target
//
//   if (rhinoEditor == null) return
//
//   // This is only for documentation, feel free to modify this as needed.
//   if (rhinoEditor.getAttribute("id") !== "syntax-highlight-editor") return
//
//   const syntaxHighlight = CodeBlockLowlight.configure({
//     lowlight,
//   })
//
//   rhinoEditor.starterKitOptions = {
//     ...rhinoEditor.starterKitOptions,
//     codeBlock: false
//   }
//
//   rhinoEditor.extensions = [syntaxHighlight]
//
//   rhinoEditor.rebuildEditor()
// }


class SyntaxHighlightEditor extends TipTapEditor {
  constructor () {
    super()
    const syntaxHighlight = CodeBlockLowlight.configure({
      lowlight,
    })

    this.starterKitOptions = {
      ...this.starterKitOptions,
      codeBlock: false
    }

    this.extensions = [syntaxHighlight]
  }
}

SyntaxHighlightEditor.define("syntax-highlight-editor")
