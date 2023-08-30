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

<% syntax_highlight_js_file = "frontend/javascript/entrypoints/syntax-highlighting.js" %>
<% syntax_highlight_css_file = "frontend/javascript/entrypoints/syntax-highlighting.css" %>

```js
<%= File.read(syntax_highlight_js_file).chomp.html_safe %>
```

```css
<%= File.read(syntax_highlight_css_file).chomp.html_safe %>
```

<script type="module" data-turbo-track="reload" src="<%= asset_path syntax_highlight_js_file.split("frontend/")[1] %>" defer></script>

<style type="text/css" data-turbo-track="reload">
<%= File.read(syntax_highlight_css_file).chomp.html_safe %>
</style>

<% html = capture do %>
<input type="hidden" id="syntax-highlight-input" value="<pre><code class='highlight-js'>console.log('Hello World')</code></pre>">
<syntax-highlight-editor id="syntax-highlight-editor" input="syntax-highlight-input"></syntax-highlight-editor>
<% end %>

```html
<%= html.chomp.html_safe %>
```

<%= html %>

<https://github.com/highlightjs/highlight.js/tree/main/src/styles>
