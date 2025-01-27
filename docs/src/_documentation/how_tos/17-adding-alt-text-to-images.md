---
title: Adding alt text to images
permalink: /how-tos/adding-alt-text-to-images/
---

Adding alt text to "previewable attachments" is quite a challenge. Rhino Editor comes with support built in. It requires patching ActionText, so it is not part of the default experience.

To start, lets configure ActionText to allow us to add the `"alt"` attribute to attachments.

<%= render Alert.new(type: :warning) do %>
 I have tried using attributes names such as "alt-text", "altText", and "alt_text" but ActionText / ActiveStorage seems to sanitize it away.
<% end %>

To do configure we can create a file at `config/initializers/actiontext_patch.rb` and add the following contents:

```rb
# config/initializers/actiontext_patch.rb

attributes = ActionText::TrixAttachment::ATTRIBUTES + ["alt"]
ActionText::TrixAttachment.const_set("ATTRIBUTES", attributes)

attributes = ActionText::Attachment::ATTRIBUTES + ["alt"]
ActionText::Attachment.const_set("ATTRIBUTES", attributes)
```

If this looks funky to you, thats because it is. I filed an issue with Rails about proper `mattr_accessor` support like other Rails modules.

<https://github.com/rails/rails/discussions/54179>

Moving on. Now that ActionText can accept the "alt" attribute, we have to configure our frontend to enable the experimental alt text editor.

To do so we can do the following:

<%- code = capture do -%>
<rhino-editor experimental-alt-text-editor></rhino-editor>
<%- end.html_safe -%>

<light-code language="html">
  <script slot="code" type="text/plain">
    <%= code %>
  </script>
</light-code>

<%= code %>
