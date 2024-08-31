---
title: Bubble Menu
permalink: /references/bubble-menu/
---

Rhino Editor comes with its own built-in bubble menu.

The reasoning for this is the bubble menu from TipTap requires writing Extensions and `shouldShow` logic and is much more heavily extension based. I wanted something more event and slot based making it a lot easier to customize and add to it (in my opinion).

You can override the bubble menu toolbar entirely like this:

```html
<rhino-editor>
  <role-toolbar slot="bubble-menu-toolbar">
    <!-- You're on your own now -->
  </role-toolbar>
</rhino-editor>
```

You can override only the inner toolbar items of the bubble menu like so:

```html
<rhino-editor>
  <div slot="bubble-menu-toolbar-items">
    <button tabindex="-1" data-role="toolbar-item">Do stuff</button>
  </div>
</rhino-editor>
```

You can add additional items:

```html
<rhino-editor>
  <div slot="before-bubble-menu-toolbar-items">
    <button tabindex="-1" data-role="toolbar-item">Do stuff</button>
  </div>
  <div slot="after-bubble-menu-toolbar-items">
    <button tabindex="-1" data-role="toolbar-item">Do stuff</button>
  </div>
</rhino-editor>
```

Or you can add additional toolbars like so:

```html
<rhino-editor>
  <role-toolbar id="table-toolbar" slot="additional-bubble-menu-toolbar">
    <button data-role="toolbar-item" tabindex="-1">Do stuff</button>
  </role-toolbar>
  <role-toolbar id="list-toolbar" slot="additional-bubble-menu-toolbar">
    <button data-role="toolbar-item" tabindex="-1">Do stuff</button>
  </role-toolbar>
</rhino-editor>
```

Finally, the bubble menu toolbar supports all the same slots as the base Rhino Editor toolbar, just with the `bubble-menu__` prefix on the slots and parts.

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

It is possible to have multiple bubble menus, and display certain buttons / elements depending on what bubble menu is being shown. The easiest way to do this is to re-use the existing bubble menu and hook into the `bubble-menu-show` event from the editor. Then, you can find the current active node and decide what to display.

<% multiple_bubble_menus = capture do %>
const rhinoEditor = document.querySelector("rhino-editor")
function handleBubbleMenuShow () {
  const listToolbar = rhinoEditor.querySelector("#list-toolbar")
  const defaultToolbar = rhinoEditor.defaultBubbleMenuToolbar

  // When the current active node, or a parent of the current active node is a list element, then
  if (rhinoEditor.editor.isActive("bulletList") || rhinoEditor.editor.isActive("orderedList")) {
    // We're on a list. Show the list bubble menu.
    listToolbar.style.display = null
    defaultToolbar.style.display = "none"
  } else {
    listToolbar.style.display = "none"
    defaultToolbar.style.display = null
  }
}

rhinoEditor.addEventListener("bubble-menu-show", handleBubbleMenuShow)
<%- end -%>


```js
<%= multiple_bubble_menus %>
```

<% content = "<ul><li><p>Select me and I can indent</p></li></ul><p></p><p>Select me and I'm the default bubble menu.</p>".html_safe %>

<% html = capture do %>
    <input id="input" type="hidden" value="<%= content %>">
    <rhino-editor input="input">
      <role-toolbar id="list-toolbar" slot="additional-bubble-menu-toolbar">
        <button>Indent</button>
        <button>Dedent</button>
      </role-toolbar>
    </rhino-editor>
    <script type="module">
      <%= multiple_bubble_menus.to_s.gsub(/\n/, "\n      ").chomp.html_safe %>
    &lt;/script>
<% end %>

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


## Disabling the bubble menu

The bubble menu can be disabled by doing the following:

<% disabled_bubble_menu = capture do %>
const rhinoEditor = document.querySelector("rhino-editor")
function disableBubbleMenu () {
  rhinoEditor.disableStarterKitOptions("rhinoBubbleMenu")
}

rhinoEditor.addEventListener("rhino-before-initialize", disableBubbleMenu)
<%- end -%>


```js
<%= disabled_bubble_menu %>
```

<light-preview
  preview-mode="shadow-dom"
  script-scope="shadow-dom"
  wrap="hard"
>
  <script type="text/plain" slot="code">
    <rhino-editor></rhino-editor>
    <script type="module">
      <%= disabled_bubble_menu.to_s.gsub(/\n/, "\n      ").chomp.html_safe %>
    &lt;/script>
  </script>
  <script type="text/plain" slot="preview-html">
    <link rel="stylesheet" href="/rhino-editor/exports/styles/trix.css">
    <rhino-editor></rhino-editor>
    <script type="module">
      <%= disabled_bubble_menu.to_s.gsub(/\n/, "\n      ").chomp.html_safe %>
    &lt;/script>
  </script>
</light-preview>


