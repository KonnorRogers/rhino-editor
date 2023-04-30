---
title: Specifying Accepted File Types
permalink: /how-tos/specifying-accepted-file-types/
---

This will tell the file choose to default to showing only images.

<% text = %(
  <rhino-editor accept="image/*"></rhino-editor>
) %>

<%= render Syntax.new("html") do %>
<%= markdownify(text) %>
<% end %>

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

Coming soon...

