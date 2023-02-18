---
"rhino-editor": minor
---

fix: autofocus is now "false" by default
BREAKING_CHANGE: defaultOptions is now editorOptions

```diff
- class ExtendedRhinoEditor extends TipTapEditor {
-   defaultOptions {
-     return {
-       super.defaultOptions(),
-       autofocus: true
-     }
-   }
- }

+ class ExtendedRhinoEditor extends TipTapEditor {
+   editorOptions {
+     return {
+       autofocus: true
+     }
+   }
+ }
```
