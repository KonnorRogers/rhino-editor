---
title: Changing Default Heading Level
permalink: /how-tos/changing-default-heading-level/
---

<rhino-editor hidden></rhino-editor>

To change the default heading level (`1`) to a different level, such as an `<h2>`, you can do so by supplying
the `default-heading-level` attribute.

<% html = capture do %>
<input id="input" type="hidden" value="<%= content %>">
<rhino-editor input="input" default-heading-level="2"></rhino-editor>
<% end %>

```html
<rhino-editor default-heading-level="2"></rhino-editor>
```

<light-preview
  preview-mode="shadow-dom"
  script-scope="shadow-dom"
  wrap="hard"
>
  <script type="text/plain" slot="code">
    <%= html.html_safe %>
  </script>
  <script type="text/plain" slot="preview-html">
    <link rel="stylesheet" href="/rhino-editor/exports/styles/trix.css">
    <%= html.html_safe %>
  </script>
</light-preview>
