---
title: Serialize to JSON
permalink: /how-tos/serialize-to-json/
---

Perhaps you have no interest in using the default ActionText implementation, and are
instead looking to serialize / deserialize JSON. This
can be done by rendering the editor with `serializer="json"`


<%= render Syntax.new("html") do %>
<input id="content" name="content">
<rhino-editor input="content" serializer="json"></rhino-editor>
<% end %>

<h2 id="caveats">
  <a href="#caveats">
    Caveats
  </a>
</h2>


The above is an advanced use-case and is not generally recommended.

When using this approach, you will have to handle the following:

- Setting up a table for the JSON to be stored
- ActiveStorage items. They will be direct uploaded, but to query for ActiveStorage items, you will be in charge of that.
- Rendering the JSON when not within the editor.

Essentially, you are circumventing all of ActionText and you're on your own now.

Enjoy the wild blue yonder!
