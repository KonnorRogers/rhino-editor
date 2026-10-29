---
"rhino-editor": patch
---

Stop re-requesting uploaded attachment images while editing. Typing in a caption, moving the caret, clicking an image, or changing its alt text no longer rebuilds its `<img>`, and the editor's internal HTML serialization no longer creates `<img>` elements in the page's document, so the image URL isn't fetched again.

The attachment node view is now kept when an uploaded attachment's attributes change, instead of being rebuilt. If you extend `Attachment` and wrap its node view to style the figure from node attributes, apply those styles again in your view's `update()` after the parent's `update()` returns `true`. If your wrapper defines `ignoreMutation`, call the parent's `ignoreMutation` too.
