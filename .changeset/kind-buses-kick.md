---
"rhino-editor": patch
---

- Fixed a bug when inserting text into figcaption causing extra `<p>` tags to appear.
- Fixed a bug with `white-space: pre-wrap` when figures get rendered in ActionText.
- Fixed the `<figcaption>` editor to behave more like Trix. On focus, if the caption is empty, it will automatically delete the caption and show the placeholder of "Add a caption".
- Fixed a bug where the editor would not rebuild if you changed the translations.
- Fixed a bug when `<figcaption>` had an empty caption you could not select the whole document with `ctrl+a`.
- Fixed a bug where `<img>` would be inserted in non-previewable attachments.
- `<figcaption>` now has a `white-space: normal` when rendered in ActionText.
- Fixed a bug where non-previewable attachments were not able to be dragged.
- Fixed a bug where stlying of `<figcaption>` placeholder text was not rendering in the correct spot.
- non-previewable attachments are no longer nested inside of Attachment Galleries.
- Added `captionPlaceholder` to the list of translations.
