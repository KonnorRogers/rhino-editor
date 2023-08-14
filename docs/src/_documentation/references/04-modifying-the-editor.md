---
title: Modifying the Editor
permalink: /references/modifying-the-editor/
---

There are 3 general ways to wait for RhinoEditor to connect to the DOM and then modify it.

- `rhino-before-initialize` - Fires when `<rhino-editor>` connects, but before the TipTap instance is created
- `rhino-initialize` - `<rhino-editor>` after the TipTap instance is created
- `customElements.whenDefined("rhino-editor").then(() => { document.querySelectorAll("rhino-editor") })` This is a general purpose callback you can use. The TipTap instance more or may not created when this is called.

You can use any of these events to modify the editor options. Heres an example for each one to add
additional heading levels.

```js
import "rhino-editor/exports/styles/trix.css"
import "rhino-editor"

document.addEventListener("rhino-before-initialize", (e) => {
  const rhinoEditor = e.target
  rhinoEditor.extensions = [MyExtension]
  rhinoEditor.addExtensions(MyOtherExtension)
  // configuring the starter kit
  rhinoEditor.starterKitOptions = { ...rhinoEditor.starterKitOptions, rhinoGallery: false }
})

document.addEventListener("rhino-initialize", (e) => {
  const rhinoEditor = e.target
  rhinoEditor.extensions = [MyExtension]
  rhinoEditor.addExtensions(MyOtherExtension)
  // configuring the starter kit
  rhinoEditor.starterKitOptions = { ...rhinoEditor.starterKitOptions, rhinoGallery: false }
})

customElements.whenDefined("rhino-editor").then(() => {
  document.querySelectorAll("rhino-editor").forEach((rhinoEditor) => {
    rhinoEditor.extensions = [MyExtension]
    rhinoEditor.addExtensions(MyOtherExtension)
    // configuring the starter kit
    rhinoEditor.starterKitOptions = { ...rhinoEditor.starterKitOptions, rhinoGallery: false }
  })
})
```

