---
title: Setup
permalink: /tutorials/setup/
---

Generally, the default setup of `rhino-editor` should be
enough. However, in the interest of leveraging the
underlying rich text editor, let's look at how we can
add, modify, or remove extensions and extend the underlying
web component.

<h2 id="configuring-extensions">
  <a href="#configuring-extensions">
    Configuring Extensions
  </a>
</h2>

First, we need to change how we import the editor.

```js
import "rhino-editor/exports/styles/trix.css"
import { TipTapEditor } from "rhino-editor/exports/elements/tip-tap-editor.js"
```

You'll notice we don't want to auto-register the
`<rhino-editor>` component. Instead, we want to extend it,
then register it.


Now we need to `extend` the existing editor.

```js
<%= File.read("./frontend/javascript/entrypoints/starter-kit-setup.js").html_safe %>
```

<script type="module" data-turbo-track="reload" src="<%= asset_path "entrypoints/starter-kit-setup" %>" defer></script>

<my-editor></my-editor>

<h2 id="adding-extensions">
  <a href="#adding-extensions">
    Adding Extensions
  </a>
</h2>

Now let's see how we would add extensions:

```js
<%= File.read("./frontend/javascript/entrypoints/character-counter.js").html_safe %>
```

```html
<!-- index.html -->
<extended-rhino-editor></extended-rhino-editor>
```

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

<script type="module" data-turbo-track="reload" src="<%= asset_path "entrypoints/character-counter" %>" defer></script>
