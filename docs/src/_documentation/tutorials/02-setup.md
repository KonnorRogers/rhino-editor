---
title: Setup
permalink: /tutorials/setup/
---

Generally, the default setup of `rhino-editor` should be
enough. However, in the interest of leveraging the
underlying rich text editor, let's look at how we can
add, modify, or remove extensions and extend the underlying
web component.

First, we need to change how we import the editor.

```js
import { RhinoEditor } from "rhino-editor/dist/elements/rhino-editor.js"
```

You'll notice we don't want to auto-register the
`<rhino-editor>` component. Instead, we want to extend it,
then register it.

Now let's see how we would add extensions:

```js
import { RhinoEditor } from "rhino-editor/dist/elements/rhino-editor.js"

// https://tiptap.dev/api/extensions/character-count
import CharacterCount from "@tiptap/extension-character-count"

class ExtendedEditor extends RhinoEditor {
  extensions () {
    return [
      // Uses all existing extensions so we're only appending
      ...super.extensions(),

      // Adds character counter
      CharacterCount.configure({
        limit: 240,
      })
    ]
  }
}

ExtendedEditor.define()
```

The above will now have a character counter in place for
the editor! This can be applied to any extensions. You
could even wipe out all existing extensions and replace
them all with your own if you wanted!
