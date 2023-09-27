---
"rhino-editor": patch
---

- `previewable` attribute is now more consistently applied and checked on attachments.
- Fixed a bug where attachments were not rendering properly when the raw action-text HTML passed to the editor.
- Fixed a bug where all attachments were not being properly rendered.
- Figcaption now jumps to the end of the block when you click on the `figure`
- `"Add a caption"` will no longer show up on custom attachments.
- Added a note about custom attachments need an actual content-type unlike Trix.
- Added a small amount of `margin-top` to `figcaption` to match Trix.
- `toMemorySize` now does not return decimales for KB / MB sizes. This is to align with Trix.
