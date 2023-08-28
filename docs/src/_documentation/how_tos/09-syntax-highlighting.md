---
title: Syntax Highlighting
permalink: /how-tos/syntax-highlighting/
---

Syntax Highlighting! Good luck doing this in Trix!

As with everything in Rhino there are 2 parts:

1. Add to our frontend editor
1. Make sure we permit tags, attributes, styles, etc in ActionText.

TipTap provides an official extension using [Lowlight](https://github.com/wooorm/lowlight)

<https://tiptap.dev/api/nodes/code-block-lowlight>

## Installation

Assuming you have Rhino installed and working, let's start by installing the additional dependencies we need.

```bash
yarn add lowlight @tiptap/extension-code-block-lowlight
```

## Adding to RhinoEditor


<% syntax_block = capture do %>
<% end %>


```js
<%= syntax_block %>
```

<script type="module">
<%= syntax_block %>
</script>

```html
<rhino-editor id="syntax-highlight-editor"></rhino-editor>
```

<rhino-editor id="syntax-highlight-editor"></rhino-editor>

