---
title: Bubble Menu
permalink: /references/bubble-menu/
---

Rhino Editor comes with its own built-in bubble menu.

You can override it entirely like this:

```html
<rhino-editor>
  <div slot="bubble-menu">
    <!-- You're on your own now -->
  </div>
</rhino-editor>
```

You can override only the inner toolbar items of the bubble menu like so:

```html
<rhino-editor>
  <div slot="bubble-menu-toolbar-items">
    <button data-role="toolbar-item">Do stuff</button>
  </div>
</rhino-editor>
```

Finally, the bubble menu toolbar supports all the same slots as the parent toolbar, just with the `bubble-menu__` prefix.

So, to render a custom file icon, you could do the following:

<% html = capture do %>
<rhino-editor>
  <svg slot="bubble-menu__strike-icon" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-paperclip" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5"></path>
  </svg>
</rhino-editor>
<% end %>

```html
<%= html %>
```

<%= html %>

Notice the slot name is `bubble-menu__strike-icon`, and the regular toolbar is just `strike-icon`.

## Multiple bubble menus

## Disabling the bubble menu

The bubble menu can be disabled by doing the following:

```js
const rhinoEditor = document.querySelector("rhino-editor")
function disableBubbleMenu () {
  rhinoEditor.disableStarterKitOptions("rhinoBubbleMenu")
}

rhinoEditor.addEventListener("rhino-before-initialize", disableBubbleMenu)
```


