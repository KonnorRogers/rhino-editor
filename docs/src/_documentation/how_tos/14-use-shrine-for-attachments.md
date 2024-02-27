---
title: Using Shrine for attachments
permalink: /use-shrine-for-attachments/
---

[Shrine](https://shrinerb.com) is a great toolkit for file attachments; and with some modifications, you can use it instead of ActiveStorage!

<%= render Alert.new(type: "primary") do %>
  For this example, we're using Shrine's [Upload Endpoint](https://shrinerb.com/docs/plugins/upload_endpoint) plugin on the server.
<% end %>

The process is:
1. Setup the endpoint on your server that will accept the attachment
2. Add the `data-direct-upload-url` attribute, which points to the endpont
3. Add an event listner for `rhino-attachment-add` that uploads the file to your endpoint, then complete the attachment
   add process with the appropriate calls to `event.attachment`


<%= render Syntax.new("js") do %>
this.addEventListener(`rhino-attachment-add`, async function(event) {
  event.preventDefault()
  const { attachment, target } = event;

  const url = event.target.dataset.directUploadUrl

  let formData = new FormData()
  formData.append('file', attachment.file, attachment.file.name)

  let response = await window.mrujs.fetch(url, {
    method: 'POST',
    body: formData,
    headers: {"Accept": "application/json"}
  });

  let result = await response.json();

  attachment.setAttributes({
    url: result.url,
  });

  attachment.setUploadProgress(100)
})
<% end %>