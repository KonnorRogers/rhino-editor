---
"rhino-editor": minor
---

- BREAKING_CHANGE: `editor.extensions()` has changed from a function to a variable via `editor.extensions`
- BREAKING_CHANGE: `editor.extensions` no longer contains the `RhinoStarterKit` and `StarterKit`. They have been moved into a private array that will be concatenated. It is recommend to instead set everything to false if you wish to disable everything.
- BREAKING_CHANGE: `editor.starterKit` has been renamed to `editor.starterKitOptions`
- BREAKING_CHANGE: `editor.rhinoStarterKit` has been removed. All starter kit options now live inside of `editor.starterKitOptions`. All `rhinoStarterKit` options have been renamed to include a `rhino*` prefix. Example: `gallery` has been renamed to `rhinoGallery.`

- feature: Adding a `tip-tap-editor-base` export for those looking to implement their own toolbar.
- feature: Modifying `starterKitOptions` will automatically update the editor.
- feature: Disabling an option in `starterKitOptions` will now also cause the toolbar to not display the disabled option.

- fix: Fixed a bug in attachments that would cause a console error when upload more than 3 attachments at once.
- fix: Fixed an issue with where TypeScript types were being generated in the wrong directory.
