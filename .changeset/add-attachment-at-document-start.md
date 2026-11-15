---
"rhino-editor": patch
---

Fix adding an attachment when the selection starts the document. After select all, or with the first node selected (such as an opening horizontal rule), adding a file from the toolbar, pasting one, or calling `setAttachment` threw `RangeError: Position -1 out of range` and added nothing. The attachment now replaces the selection, as it already does for any other selection.
