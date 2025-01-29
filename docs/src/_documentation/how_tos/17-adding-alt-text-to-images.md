---
title: Adding alt text to images
permalink: /how-tos/adding-alt-text-to-images/
---

Adding alt text to "previewable attachments" is quite a challenge. Rhino Editor comes with support built in, but it requires patching ActionText, so it is not part of the default experience.

To start, lets configure ActionText to allow us to add the `"alt"` attribute to attachments.

<%= render Alert.new(type: :warning) do %>
 I have tried using other attribute names such as "alt-text", "altText", and "alt_text" but ActionText / ActiveStorage seem to sanitize it away.

 <https://github.com/rails/rails/discussions/54179>
<% end %>

To configure ActionText, we can create a file at `config/initializers/actiontext_patch.rb` and add the following content:

```rb
# config/initializers/actiontext_patch.rb

attributes = ActionText::TrixAttachment::ATTRIBUTES + ["alt"]
ActionText::TrixAttachment.const_set("ATTRIBUTES", attributes)

attributes = ActionText::Attachment::ATTRIBUTES + ["alt"]
ActionText::Attachment.const_set("ATTRIBUTES", attributes)
```

If this looks funky to you, thats because it is. I filed an issue with Rails about proper `mattr_accessor` support like other Rails modules to make this API nicer to work with.

<https://github.com/rails/rails/discussions/54179>

Moving on, now that ActionText can accept the "alt" attribute, we have to configure Rhino Editor to enable the alt text editor.

## Enabling alt text editor

To enable the alt text editor, we can do the following:

<%- code = capture do -%>
<rhino-editor alt-text-editor></rhino-editor>
<%- end.html_safe -%>

<light-code language="html">
  <script slot="code" type="text/plain">
    <%= code %>
  </script>
</light-code>

## Alt text editor example

Add an attachment below to test out the attachment editor.

<%= code %>

## Add the alt attribute to your attachments

The final step to making our alt text work is we need to modify `app/views/active_storage/blobs/_blob.html.erb`

By default this file should look something like this:


<light-code language="ruby">
  <script type="text/plain" slot="code">
    <!-- app/views/active_storage/blobs/_blob.html.erb -->
    <figure class="attachment attachment--<%%= blob.representable? ? "preview" : "file" %> attachment--<%%= blob.filename.extension %>">
      <%% if blob.representable? %>
        <%%= image_tag(blob.representation(resize_to_limit: local_assigns[:in_gallery] ? [ 800, 600 ] : [ 1024, 768 ]) %>
      <%% end %>

      <%% caption = blob.try(:caption) %>
      <figcaption class="attachment__caption <%%= caption ? "attachment__caption--edited" : "" %>">
        <%% if caption %>
          <%%= caption.html_safe %>
        <%% else %>
          <span class="attachment__name"><%%= blob.filename %></span>
          <span class="attachment__size"><%%= number_to_human_size blob.byte_size %></span>
        <%% end %>
      </figcaption>
    </figure>
  </script>
</light-code>

What we need to do is modify a couple of lines to add the alt text:

<light-code langauge="ruby"  inserted-lines="{4-5}" deleted-lines="{6}">
  <script type="text/plain" slot="code">
    <!-- app/views/active_storage/blobs/_blob.html.erb -->
    <figure class="attachment attachment--<%%= blob.representable? ? "preview" : "file" %> attachment--<%%= blob.filename.extension %>">
      <%% if blob.representable? %>
        <%% blob_attributes = blob.full_attributes %>
        <%%= image_tag(blob.representation(resize_to_limit: local_assigns[:in_gallery] ? [ 800, 600 ] : [ 1024, 768 ], alt: blob_attributes["alt"]) %>
        <%%= image_tag(blob.representation(resize_to_limit: local_assigns[:in_gallery] ? [ 800, 600 ] : [ 1024, 768 ]) %>
      <%% end %>

      <%% caption = blob.try(:caption) %>
      <figcaption class="attachment__caption <%%= caption ? "attachment__caption--edited" : "" %>">
        <%% if caption %>
          <%%= caption.html_safe %>
        <%% else %>
          <span class="attachment__name"><%%= blob.filename %></span>
          <span class="attachment__size"><%%= number_to_human_size blob.byte_size %></span>
        <%% end %>
      </figcaption>
    </figure>
  </script>
</light-code>

And thats it! You should be all set up with alt text now!
