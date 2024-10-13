---
title: Add Additional Attributes onto the Editor
permalink: /how-tos/add-additional-attributes-onto-the-editor/
---

Sometimes you may want to add additional attributes directly onto the `contenteditable` of RhinoEditor.

The easiest way to do this is by slotting in an editor with the attributes you would like. Here's an example of how we
could add `aria-*` attributes onto the editor in cases where perhaps the form failed validation.

```erb
<rhino-editor>
  <!-- This will get replaced by a new <div>, but will have the attributes copied. -->
  <div slot="editor" aria-invalid="<%%= object.errors.any? %>" aria-describedby="description-errors">
  </div>
</rhino-editor>

<div id="description-errors">
  <%% if object.errors.any? %>
    <%%= object.errors.to_s %>
  <%% end %>
</div>
```

This will produce something like the following:

```html
<rhino-editor>
  <!-- This will get replaced by a new <div>, but will have the attributes copied. -->
  <div slot="editor" aria-invalid="true" aria-describedby="description-errors">
  </div>
</rhino-editor>

<div id="description-errors">
  Wow dude. You really messed up. What did you even submit?
</div>
```
