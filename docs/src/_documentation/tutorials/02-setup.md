---
title: Setup
permalink: /tutorials/setup/
---

Generally, the default setup of `rhino-editor` should be
enough. However, in the interest of leveraging the
underlying rich text editor, let's look at how we can
add, modify, or remove extensions and extend the underlying
web component.

### Adding functionality to an existing editor

The easiest way to modify an editor is by listening to the `rhino-before-initialize` event
and modifying it's options.

Heres a simple example to remove galleries and add all heading levels.

```js
function modifyEditor (e) {
  const editor = e.target
  editor.starterKitOptions = {
    ...editor.starterKitOptions,
    heading: {
      // Enable all heading levels
      levels: [1, 2, 3, 4, 5, 6],
    },
    // Disables the gallery for attachments.
    rhinoGallery: false
  }
}

document.addEventListener("rhino-before-initialize", modifyEditor)
```

For more reading on other ways to modify an existing editor without extends the custom
element class, check out this reference documentation on [modifying the editor](/references/modifying-the-editor).


### Extending the base class

If you plan to do the same thing across the entire app and may have many instances of
RhinoEditor running, it may be worth extending
the RhinoEditor base class and adding your additional functionality.

<%= render Syntax.new("js") do %>
import "rhino-editor/exports/styles/trix.css"
import { TipTapEditor } from "rhino-editor/exports/elements/tip-tap-editor.js"
<% end %>

You'll notice we don't want to auto-register the
`<rhino-editor>` component. Instead, we want to extend it,
then register it.

<%= render Syntax.new("js") do %>
<%= File.read("frontend/javascript/entrypoints/starter-kit-setup.js").chomp.html_safe %>
<% end %>

<script type="module" data-turbo-track="reload" src="<%= asset_path "javascript/entrypoints/starter-kit-setup.js" %>" defer></script>

<my-editor></my-editor>

<h2 id="adding-extensions">
  <a href="#adding-extensions">
    Adding Extensions
  </a>
</h2>

Now let's see how we would add extensions:

```js
<%= File.read("./frontend/javascript/entrypoints/character-counter.js").chomp.html_safe %>
```

<%= render Syntax.new("html") do %>
<!-- index.html -->
<extended-rhino-editor></extended-rhino-editor>
<% end %>

The above will now have a character counter in place for
the editor! This can be applied to any extensions. You
could even wipe out all existing extensions and replace
them all with your own if you wanted!


<h3 id='character-count-example'>
  <a href='#character-count-example'>
    Character Count Example
  </a>
</h3>

<input id="character-counter" type="hidden" value="<p>I'm a rhino editor with a character counter!</p>">
<extended-rhino-editor input="character-counter"></extended-rhino-editor>

<script type="module" data-turbo-track="reload" src="<%= asset_path "javascript/entrypoints/character-counter.js" %>" defer></script>
