---
title: Editor Events
permalink: /editor-events/
---

Equivalent Trix Events: <https://github.com/basecamp/trix/blob/main/README.md#observing-editor-changes>

<%= render Alert.new(type: "primary") do %>
  Events marked with checkmarks have been implemented. Events without checkmarks
  have not been implemented yet.
<% end %>

- [x] `rhino-before-initialize` fires when the `<rhino-editor>` element is attached to the DOM just before Rhino installs its editor object.

- [x] `rhino-initialize` fires when the `<rhino-editor>` element is attached to the DOM and its editor object is ready for use.

- [x] `rhino-change` fires whenever the editor’s contents have changed.

- [x] `rhino-paste` fires whenever text is pasted into the editor. The paste property on the event contains the pasted string or html, and the range of the inserted text.

- [x] `rhino-selection-change` fires any time the selected range changes in the editor.

- [x] `rhino-focus` and `rhino-blur` fire when the editor gains or loses focus, respectively.

- [x] `rhino-file-accept` fires when a file is dropped or inserted into the editor. You can access the DOM File object through the `file` property on the event. Call `event.preventDefault()` on the event to prevent attaching the file to the document.

- [x] `rhino-attachment-add` fires after an attachment is added to the document. You can access the Rhino attachment object through the attachment property on the event. If the attachment object has a file property, you should store this file remotely and set the attachment’s URL attribute. See the attachment example for detailed information.

- [x] `rhino-attachment-remove` fires when an attachment is removed from the document. You can access the Rhino attachment object through the attachment property on the event. You may wish to use this event to clean up remotely stored files.

## Direct Upload Events

(Thank you Matheus Rich for the inspiration!)

<https://github.com/rails/rails/pull/52680>

Direct Uploads now have the following events you can listen to in the editor. All of the events have the `event.attachmentManager` property which should have all the information you need to react appropriately.

- [ ] - `direct-upload:start` - called when the upload starts.
- [ ] - `direct-upload:progress` - Called periodically as the editor progesses.
- [ ] - `direct-upload:error` - Called when the upload errors.
- [ ] - `direct-upload:end` - Called when the upload has finished. This will not get called if there is an error.

