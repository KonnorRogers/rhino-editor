---
title: Customizing the toolbar
permalink: /how-tos/customizing-the-toolbar/
---

Rather than using JavaScript to define the toolbar like in Trix, Rhino Editor
takes the approach of slotting in HTML.

Heres an example of "slotting" in an embed button.

```html
<rhino-editor>
  <button type="button">Embed</button>
</rhino-editor>
```

<rhino-editor>
  <button type="button">Embed</button>
</rhino-editor>

<%= Alert.new(type: :danger, title: "Note") do %>
  It is up to you to style buttons that you slot in.
  Rhino Editor will not style them for you.
<% end %>
