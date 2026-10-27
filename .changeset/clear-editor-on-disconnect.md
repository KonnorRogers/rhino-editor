---
"rhino-editor": patch
---

Clear `rhino.editor` when the element disconnects. Previously, an update queued before removal (for example by the blur fired during a Turbo navigation) could render the toolbar against the destroyed editor, which throws `Cannot read properties of null (reading 'commands')` on `@tiptap/core` 3.24+ when `rhinoLink` is `false`. Code that reads `rhino.editor` after the element is removed now gets `null` instead of a destroyed editor.
