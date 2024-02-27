---
title: Using Shrine for attachments
permalink: /how-tos/use-shrine-for-attachments/
---

[Shrine](https://shrinerb.com) is a great toolkit for file attachments; and with some modifications, you can use it instead of ActiveStorage!

<%= render Alert.new(type: "primary") do %>
  For this example, we're using Shrine's [Upload Endpoint](https://shrinerb.com/docs/plugins/upload_endpoint) plugin on the server.
<% end %>

The process is:
1. Setup the endpoint on your server that will accept the attachment
2. Add the `data-direct-upload-url` attribute, which points to the endpont
3. Add an event listener for `rhino-attachment-add` that uploads the file to your endpoint, then complete the attachment
   add process with the appropriate calls to `event.attachment`

```js
document.addEventListener(`rhino-attachment-add`, async function(event) {
  event.preventDefault()
  const { attachment, target } = event;

  // Grab the `data-direct-upload` string for uploading to Shrine.
  const url = event.target.dataset.directUploadUrl

  let formData = new FormData()
  formData.append('file', attachment.file, attachment.file.name)

  // If you have CSRF checks enabled for this endpoint, you may need a library like
  // request.js or mrujs to fetch with the proper CSRF headers / tokens.
  let response = await fetch(url, {
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
```

Do note, because we are using the `fetch()` API, there's no way to properly show a progress bar for upload progress.
If you want to implement upload progress, you can use the `XMLHttpRequest` API which does support
upload progress.
