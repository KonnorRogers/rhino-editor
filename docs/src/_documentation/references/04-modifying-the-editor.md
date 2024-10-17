---
title: Modifying the Editor
permalink: /references/modifying-the-editor/
---

There are 3 general ways to wait for RhinoEditor to connect to the DOM and then modify it.

- `rhino-before-initialize` - Fires when `<rhino-editor>` connects, but before the TipTap instance is created
- `rhino-initialize` - `<rhino-editor>` after the TipTap instance is created
- `customElements.whenDefined("rhino-editor").then(() => { document.querySelectorAll("rhino-editor") })` This is a general purpose callback you can use. The TipTap instance more or may not created when this is called.

<%= render Alert.new(type: :info) do %>
If you are having trouble catching the `rhino-initialize` or the `rhino-before-initialize` events read the section on [Delaying Initialization](#delaying-initialization)
<% end %>

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

## Delaying Initialization

Sometimes it can be quite challenging to catch either the `rhino-initialize` or `rhino-before-initialize` events due to load order of your JavaScript.

If you add the `defer-initialization` attribute to your editor, the editor will not start until you remove that attribute.

Like so:

```html
<rhino-editor defer-initialize></rhino-editor>

<script type="module">
  // Setup your event listeners to modify the editor *before* removing the `defer-initialize` attribute.
  document.addEventListener("rhino-before-initialize", () => {})

  // The editor will initialize and start the TipTap instance.
  document.querySelectorAll("rhino-editor").forEach((el) => el.removeAttribute("defer-initialize"))
</script>
```
