---
title: Specifying Accepted File Types
permalink: /how-tos/specifying-accepted-file-types/
---

This will tell the file chooser to default to showing only images and will
get forwarded to a hidden `<input type="file">` in the shadow root.

<% text = %(<rhino-editor accept="image/*"></rhino-editor>) %>

```html
<%= markdownify(text) %>
```

<%= text.html_safe %>

<%= render Alert.new(type: :danger, title: "Caution") do %>
  Users can still override the behavior and upload any file. It is recommended to
  sanitize files on your server, and also read the section below of preventing
  file uploads.
<% end %>


<h2 id="preventing-uploads">
  <a href="#preventing-uploads">
    Preventing Uploads
  </a>
</h2>

<% text = capture do %>
function pngOnly (event) {
  if (event.file.type !== 'image/png') {
    event.preventDefault()
  }
}
document.querySelector("#png-only").addEventListener('rhino-file-accept', pngOnly)
<% end %>

```js
<%= text.html_safe %>
```

<script type="module">
  <%= text.html_safe %>
</script>


<% text = %(<rhino-editor id="png-only"></rhino-editor>) %>
```html
<%= markdownify(text) %>
```

<%= text.html_safe %>

