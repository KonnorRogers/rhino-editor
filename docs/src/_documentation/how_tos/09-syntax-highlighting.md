---
title: Syntax Highlighting
permalink: /how-tos/syntax-highlighting/
---

Syntax Highlighting! Good luck doing this in Trix!

As with everything in Rhino there are 2 parts:

1. Add to our frontend editor
1. Make sure we permit tags, attributes, styles, etc in ActionText.

Luckily for us, we don't need to do the second part! The syntax highlighter we'll be using from TipTap only uses `<span>`, `<pre>`, and `<code>` which are already permitted by default in ActionText.

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
<rhino-editor id="syntax-highlight-editor" input="syntax-highlight-input"></rhino-editor>
<% end %>

```html
<%= html.chomp.html_safe %>
```

<%= html %>

For additional themes, you can checkout the [HighlightJS](https://github.com/highlightjs/highlight.js) repo which Lowlight uses internally. The link for the CSS themes is below:

<https://github.com/highlightjs/highlight.js/tree/main/src/styles>
