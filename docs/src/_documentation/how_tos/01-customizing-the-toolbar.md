---
title: Customizing the toolbar
permalink: /how-tos/customizing-the-toolbar/
---

Rather than using JavaScript to define the toolbar like in Trix, Rhino Editor
takes the approach of slotting in HTML.

Heres an example of "slotting" in an embed button.

```html
<rhino-editor>
  <button
    type="button"
    slot="before-undo-button"
    class="rhino-toolbar-button"
    data-role="toolbar-item"
    tabindex="-1"
  >
    Embed
  </button>
</rhino-editor>
```

<rhino-editor>
  <button
    type="button"
    slot="before-undo-button"
    class="rhino-toolbar-button"
    data-role="toolbar-item"
    tabindex="-1"
  >
    Embed
  </button>
</rhino-editor>


<br><br>

<%= render Alert.new(type: :warning, title: "Note") do %>
  Hi
<% end %>
