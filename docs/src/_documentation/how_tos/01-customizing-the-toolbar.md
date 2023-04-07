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



<br>

<%= render Alert.new(type: :warning, title: "Note") do %>
  Make sure to add `type="button"` so that the buttons do not submit the form. Also make sure
  to add `data-role="toolbar-item"` to have the toolbar work correctly and `tabindex="-1"`.
<% end %>


<h2 id="understanding-slots">
  <a href="#understanding-slots">
    Understanding Slots
  </a>
</h2>

Each toolbar button has a number of corresponding slots. For example you have
`before-bold-button` slot which lets you insert something before the bold button.
There is a corresponding `after-bold-button` and theres also a `bold-button` slot
which lets you insert your own button.

<%= render Alert.new(type: :danger) do %>
  When overriding buttons in the toolbar, you are now in charge of adding functionality
  and accounting for accessibility.
<% end %>

<h2 id="changing-icons">
  <a href="#changing-icons">
    Changing Icons
  </a>
</h2>

Maybe you just want to change the icons and dont need to override the whole
toolbar or an entire button within the toolbar. That can be done by using the `*-icon`.

For example, here's how we would override the attachment button icon using an icon
from <https://tabler-icons.io>

<% text = %(
<rhino-editor>
  <svg slot="attach-files-icon" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-paperclip" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5"></path>
  </svg>
</rhino-editor>
) %>

```html
<%= markdownify(text) %>
```

<%= text.html_safe %>
