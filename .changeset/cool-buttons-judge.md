---
"rhino-editor": patch
---

- Fixed a conflict where ActiveStorage attachments not bound via custom attachments (like Mentions via TipTap extension) would get parsed by RhinoEditor by ignoring `contentType="application/octet-stream"` on attachments.
