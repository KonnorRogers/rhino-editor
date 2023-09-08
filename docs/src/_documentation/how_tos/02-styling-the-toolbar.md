---
title: Styling the toolbar
permalink: /how_tos/styling-the-toolbar/
---


The toolbar in Rhino Editor is implemented using a custom element. I created
the custom element to be a proper [Toolbar](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/)

You can style the toolbar like so:

```css
.rhino-editor::part(toolbar) {}
```

But this may not always be enough. If you need to for example remove the `border-color` you'd
want to do:

```css
.rhino-editor::part(toolbar__base) {
  border-color: transparent;
}
```

Putting it altogether, we could do something like this and make the toolbar look closer
to the one that ship with Trix.


<% css = capture do %>
#toolbar-styling-example::part(toolbar) {
  margin-bottom: 1rem;
}

#toolbar-styling-example::part(toolbar__base) {
  /* 1px so we can show the outline of the buttons */
  padding-left: 1px;
  padding-right: 1px;
  border-color: transparent;
}
<% end.chomp.html_safe %>

```css
<%= css %>
```

<style>
<%= css %>
</style>

<rhino-editor id="toolbar-styling-example"></rhino-editor>

## Styling the buttons

Bringing it one step further, we can look at what it takes to style buttons.

Buttons also have `part`s attached to them.

Here's an example of the parts available on the `undo` button.

```css
/* Applies to all toolbar buttons */
.rhino-editor::part(toolbar__button) {}

/* Applies to "active" buttons which in practical terms is any button highlighted blue due to it being active in the editor. */
.rhino-editor::part(toolbar__button--active) {}

/* Applies to "disabled" buttons (buttons which are not currently usable) */
.rhino-editor::part(toolbar__button--disable) {}

/* Only applies to undo button */
.rhino-editor::part(toolbar__button--undo) {}
```

Buttons also have `tooltip` parts you can tap into.

```css
.rhino-editor::part(toolbar__tooltip) {}
.rhino-editor::part(toolbar__tooltip--undo) {}
```

Buttons also have `slot`s available if the CSS parts aren't enough.

```html
<rhino-editor>
  <svg slot="undo-icon"></svg>
  <my-super-cool-tooltip slot="undo-tooltip"></my-super-cool-tooltip>
</rhino-editor>
```
