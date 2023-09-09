---
title: Change the editor border on focus
permalink: /change-the-editor-border-on-focus/
---

This is kind of a silly example, but instead of using `:focus`, the default styles use
`:focus-within`. Let's make it super obvious how we can changed the border color on `:focus-within`

<% css = capture do %>
rhino-editor .trix-content {
  border-width: 3px;
  border-color: blue;
}

rhino-editor .trix-content:focus-within {
  border-color: red;
}
<% end.html_safe.chomp %>



```css
<%= css %>
```

<style>
  <%= css %>
</style>
<rhino-editor>

</rhino-editor>

Pretty straightforward! But worth documenting since most people would expect to override `:focus`.
