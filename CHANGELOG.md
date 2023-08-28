# Changelog

## 0.7.0

### Minor Changes

- a83e08d: Added trix compatibility events
- 1a34f1d: - BREAKING_CHANGE: `editor.extensions()` has changed from a function to a variable via `editor.extensions`

  - BREAKING_CHANGE: `editor.extensions` no longer contains the `RhinoStarterKit` and `StarterKit`. They have been moved into a private array that will be concatenated. It is recommend to instead set everything to false if you wish to disable everything.
  - BREAKING_CHANGE: `editor.starterKit` has been renamed to `editor.starterKitOptions`
  - BREAKING_CHANGE: `editor.rhinoStarterKit` has been removed. All starter kit options now live inside of `editor.starterKitOptions`. All `rhinoStarterKit` options have been renamed to include a `rhino*` prefix. Example: `gallery` has been renamed to `rhinoGallery.`
  - feature: Adding a `tip-tap-editor-base` export for those looking to implement their own toolbar.
  - feature: Modifying `starterKitOptions` will automatically update the editor.
  - feature: Disabling an option in `starterKitOptions` will now also cause the toolbar to not display the disabled option.
  - fix: Fixed a bug in attachments that would cause a console error when upload more than 3 attachments at once.
  - fix: Fixed an issue with where TypeScript types were being generated in the wrong directory.

### Patch Changes

- a83e08d: Fixed .rhino-toolbar-button not inheriting color
- e7a44d3: Fixed a bug in lists to allow show proper highlighting and allow nesting

## 0.6.1

### Patch Changes

- 3798f31: fixed a bug causing rhino-editor to load ProseMirror multiple times
- 3798f31: Added `rhino-file-accept` event to align with `trix-file-accept`
  Added documentation on preventing file uploads

## 0.6.0

### Minor Changes

- f03f155: Add error messages for failed uploads
- f03f155: Added increase / decrease indentation

### Patch Changes

- f03f155: Upgrade to v2.0.2 of TipTap, fix flaky test suite, improve mobile safari support.
- 560c5a3: Fix image uploader alignment

## 0.5.0

### Minor Changes

- ed77144: Upgrade prosemirror and tiptap (v2.0.2) dependencies

### Patch Changes

- ed77144: Allow configuring rhino and starterkit options
- ed77144: fixed a bug where settings galleries: false would crash the editor.

## 0.4.0

### Minor Changes

- 4e293f3: fix: move editor from shadow dom to light dom
  docs: Updated docs to reflect new CSS import

  BREAKING_CHANGE: The editor has been moved to the light DOM and CSS must now be imported.

- 4e293f3: adjusted styles by reducing focus-ring and comibing editor + toolbar
- 51fcfa2: Add "accept" attribute for file uploading

## 0.3.2

### Patch Changes

- b7b335c: fix: bad entrypoint

## 0.3.1

### Patch Changes

- 0a59f7a: fix: everything was disabled, tweak some color values

## 0.3.0

### Minor Changes

- 84ff18b: fix: autofocus is now "false" by default
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

  feat: created a `/cdn/exports` route for CDN users.

## 0.2.0

### Minor Changes

- 4a5d781: Rename "dist" to "exports".
  Remap internal files paths to "exports" and "internal".

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.1.1](https://github.com/KonnorRogers/rhino-editor/compare/v0.1.0...v0.1.1) (2023-01-21)

### ⚠ BREAKING CHANGES

- rename all internal views to use kebab-case (#24)
- CSS now uses 'rhino' prefix (#19)

### Bug Fixes

- CSS now uses 'rhino' prefix ([#19](https://github.com/KonnorRogers/rhino-editor/issues/19)) ([eeae3c2](https://github.com/KonnorRogers/rhino-editor/commit/eeae3c21607e61c3e5283da1dd1225a6554d4eb9))
- minor styling issues ([b35b6b7](https://github.com/KonnorRogers/rhino-editor/commit/b35b6b7447d6e465414e5987aee040cf62ee2209))
- rename all internal views to use kebab-case ([#24](https://github.com/KonnorRogers/rhino-editor/issues/24)) ([c5b5f3a](https://github.com/KonnorRogers/rhino-editor/commit/c5b5f3a38fcd2a543aa18f2ce0e176d00d2a9dcf))

## [0.1.0](https://github.com/KonnorRogers/rhino-editor/compare/v0.0.2...v0.1.0) (2022-12-24)

### Bug Fixes

- borked svg sizes on safari ([e56b176](https://github.com/KonnorRogers/rhino-editor/commit/e56b176539509aa109df00c456804084473dc276))

### [0.0.2](https://github.com/KonnorRogers/rhino-editor/compare/v0.0.1...v0.0.2) (2022-12-07)

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
