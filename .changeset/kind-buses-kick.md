---
"rhino-editor": patch
---

- Fixed a bug when inserting text into figcaption causing extra `<p>` tags to appear.
- Fixed a bug with `white-space: pre-wrap` when figures get rendered in ActionText.
- Fixed the `<figcaption>` editor to behave more like Trix. On focus, if the caption is empty, it will automatically delete the caption and show the placeholder of "Add a caption".
- Fixed a bug where the editor would not rebuild if you changed the translations.
- Added `captionPlaceholder` to the list of translations.
