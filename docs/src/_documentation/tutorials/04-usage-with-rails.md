---
title: Usage with Rails
permalink: /tutorials/usage-with-rails/
---

## [Prerequisites](#prerequisites)

Ash Editor is designed to work with ActiveStorage + ActionText. So make sure both
are installed and working in your app before pulling in Ash Editor.

- ActiveStorage: <https://guides.rubyonrails.org/active_storage_overview.html#setup>
- ActionText: <https://guides.rubyonrails.org/action_text_overview.html#installation>

## [View Helpers](#view-helpers)

Currently, Ash Editor does not ship any view helpers for Rails. This may change in
the future to make usage easier, but for now we can mimic how Trix handles it.

Let's imagine we had a model like the following:

```rb
class Post < ApplicationRecord
  has_rich_text :body
end
```

To achieve the same interaction as `form.rich_text_area :body` from Trix,
we can do the following:

```erb
<%%= form_with model: @post do |form| %>
  <%%= form.hidden_field :body, value: @post.body.try(:to_trix_html) || @post.body %>
  <ash-editor
    input="post_body"
    data-blob-url-template="<%%= rails_service_blob_url(":signed_id", ":filename") %>"
    data-direct-upload-url="<%%= rails_direct_uploads_url %>"
  ></ash-editor>
<%% end %>
```

Which should output HTML that looks something like this:

```html
<form>
  <input value="" autocomplete="off" type="hidden" name="post[body]" id="post_body">
  <ash-editor
    input="post-body"
    data-blob-url-template="http://localhost:5100/rails/active_storage/blobs/redirect/:signed_id/:filename"
    data-direct-upload-url="http://localhost:5100/rails/active_storage/direct_uploads"
  ></ash-editor>
</form>
```
