---
title: Editor Events
permalink: /editor-events/
---

Equivalent Trix Events: https://github.com/basecamp/trix/blob/main/README.md#observing-editor-changes

<%= Alert.new(type: "primary") do %>
  Events marked with checkmarks have been implemented. Events without checkmarks
  have not been implemented yet.
<% end %>

- [ ] `rhino-before-initialize` fires when the `<rhino-editor>` element is attached to the DOM just before Rhino installs its editor object.

- [ ] `rhino-initialize` fires when the `<rhino-editor>` element is attached to the DOM and its editor object is ready for use.

- [ ] `rhino-change` fires whenever the editor’s contents have changed.

- [ ] `rhino-paste` fires whenever text is pasted into the editor. The paste property on the event contains the pasted string or html, and the range of the inserted text.

- [ ] `rhino-selection-change` fires any time the selected range changes in the editor.

- [ ] `rhino-focus` and `rhino-blur` fire when the editor gains or loses focus, respectively.

- [x] `rhino-file-accept` fires when a file is dropped or inserted into the editor. You can access the DOM File object through the file property on the event. Call `event.preventDefault()` on the event to prevent attaching the file to the document.

- [x] `rhino-attachment-add` fires after an attachment is added to the document. You can access the Rhino attachment object through the attachment property on the event. If the attachment object has a file property, you should store this file remotely and set the attachment’s URL attribute. See the attachment example for detailed information.

- [ ] `rhino-attachment-remove` fires when an attachment is removed from the document. You can access the Rhino attachment object through the attachment property on the event. You may wish to use this event to clean up remotely stored files.

