# Changelog

## 0.10.2

### Patch Changes

- [#185](https://github.com/KonnorRogers/rhino-editor/pull/185) [`2a6fb5b`](https://github.com/KonnorRogers/rhino-editor/commit/2a6fb5bd5f63cab016d62f77f3d3eba39748662d) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Add `initializationComplete` async function for listening to initialization

- [#185](https://github.com/KonnorRogers/rhino-editor/pull/185) [`2a6fb5b`](https://github.com/KonnorRogers/rhino-editor/commit/2a6fb5bd5f63cab016d62f77f3d3eba39748662d) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fixed initialization events to be more reliable to catch

## 0.10.1

### Patch Changes

- [#182](https://github.com/KonnorRogers/rhino-editor/pull/182) [`c64173a`](https://github.com/KonnorRogers/rhino-editor/commit/c64173a02b7f84c77edf3dba6a3642cf8e2e0619) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fixed a bug in the update lifecycles of RhinoEditor causing rebuilds to happen too frequently

## 0.10.0

### Minor Changes

- [#178](https://github.com/KonnorRogers/rhino-editor/pull/178) [`abddbac`](https://github.com/KonnorRogers/rhino-editor/commit/abddbac90ffd69aa77e47b3ff9c78bf4e25309f2) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Add `getHTMLContentFromRange()` and `getTextContentFromRange()` functions

- [#176](https://github.com/KonnorRogers/rhino-editor/pull/176) [`fd8cc08`](https://github.com/KonnorRogers/rhino-editor/commit/fd8cc0873fbade6a2f9eeeb3259872c11a50836d) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - upgrade TipTap versions to 2.4.0

### Patch Changes

- [#176](https://github.com/KonnorRogers/rhino-editor/pull/176) [`fd8cc08`](https://github.com/KonnorRogers/rhino-editor/commit/fd8cc0873fbade6a2f9eeeb3259872c11a50836d) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fixed an issue where updating translations would not update the editor

- [#178](https://github.com/KonnorRogers/rhino-editor/pull/178) [`abddbac`](https://github.com/KonnorRogers/rhino-editor/commit/abddbac90ffd69aa77e47b3ff9c78bf4e25309f2) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fixed a bug where the current focused figure did not have an outline

- [#178](https://github.com/KonnorRogers/rhino-editor/pull/178) [`abddbac`](https://github.com/KonnorRogers/rhino-editor/commit/abddbac90ffd69aa77e47b3ff9c78bf4e25309f2) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Close link dialogs when clicking outside the editor or on other toolbar items

- [#176](https://github.com/KonnorRogers/rhino-editor/pull/176) [`fd8cc08`](https://github.com/KonnorRogers/rhino-editor/commit/fd8cc0873fbade6a2f9eeeb3259872c11a50836d) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - - Fixed `tooltip-arrow` and `tooltip-base` parts renamed to `toolbar__tooltip__arrow` and `toolbar__tooltip__base` respectively.

- [#178](https://github.com/KonnorRogers/rhino-editor/pull/178) [`abddbac`](https://github.com/KonnorRogers/rhino-editor/commit/abddbac90ffd69aa77e47b3ff9c78bf4e25309f2) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fixed a bug where figcaptions would never update if you did not interact with the editor

## 0.9.3

### Patch Changes

- [#170](https://github.com/KonnorRogers/rhino-editor/pull/170) [`bb3f160`](https://github.com/KonnorRogers/rhino-editor/commit/bb3f16057056a9fa2ac69dfb5e4562f060382de6) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fixed a bug with removing attachments

## 0.9.2

### Patch Changes

- [#163](https://github.com/KonnorRogers/rhino-editor/pull/163) [`65a86d1`](https://github.com/KonnorRogers/rhino-editor/commit/65a86d1b61dd333d36fb8a8d069debd6c2136916) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Docs: Added documentation for importmaps workaround

## 0.9.1

### Patch Changes

- [#150](https://github.com/KonnorRogers/rhino-editor/pull/150) [`98bb49c`](https://github.com/KonnorRogers/rhino-editor/commit/98bb49caf67c3d0f83fe4e3a2413da937cd8fa31) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Add default word-break to .trix-content <https://github.com/basecamp/trix/pull/1126>

## 0.9.0

### Minor Changes

- [#143](https://github.com/KonnorRogers/rhino-editor/pull/143) [`13dce87`](https://github.com/KonnorRogers/rhino-editor/commit/13dce878f5aed3479bf8a783141283b9925c19af) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - BREAKING_CHANGE: Allow the light-dom editor to be slotted. Do note, this change may result in a small breaking change for the users relying on the original light-dom structure being `div > div.trix-content`. Most users should not see a difference.

### Patch Changes

- [#142](https://github.com/KonnorRogers/rhino-editor/pull/142) [`a69c1cc`](https://github.com/KonnorRogers/rhino-editor/commit/a69c1cc1d11762584e474a823ec2c0a838b196e4) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - fix: `openOnClick` for links is now set to `false` by default in the editor. This fixes some bugs around editing links and was the original intended behavior.

- [#143](https://github.com/KonnorRogers/rhino-editor/pull/143) [`13dce87`](https://github.com/KonnorRogers/rhino-editor/commit/13dce878f5aed3479bf8a783141283b9925c19af) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - fix: link-dialog buttons now have proper hover / focus state.

## 0.8.7

### Patch Changes

- [#136](https://github.com/KonnorRogers/rhino-editor/pull/136) [`ba79275`](https://github.com/KonnorRogers/rhino-editor/commit/ba7927570d8333ea45810396c8f22db9d868b6ab) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - - `previewable` attribute is now more consistently applied and checked on attachments.
  - Fixed a bug where attachments were not rendering properly when the raw action-text HTML passed to the editor.
  - Fixed a bug where all attachments were not being properly rendered.
  - Figcaption now jumps to the end of the block when you click on the `figure`
  - `"Add a caption"` will no longer show up on custom attachments.
  - Added a note about custom attachments need an actual content-type unlike Trix.
  - Added a small amount of `margin-top` to `figcaption` to match Trix.
  - `toMemorySize` now does not return decimales for KB / MB sizes. This is to align with Trix.

## 0.8.6

### Patch Changes

- [#132](https://github.com/KonnorRogers/rhino-editor/pull/132) [`d760195`](https://github.com/KonnorRogers/rhino-editor/commit/d76019523f2db5f592f8f86b3b3fee8cd8028882) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - - Fixed a bug when inserting text into figcaption causing extra `<p>` tags to appear.
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

## 0.8.5

### Patch Changes

- [#128](https://github.com/KonnorRogers/rhino-editor/pull/128) [`fae7c47`](https://github.com/KonnorRogers/rhino-editor/commit/fae7c474536e8139e078dc8d39fd105e6241212a) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - - Fix rendering of inline previews of images on Mobile Safari.

## 0.8.4

### Patch Changes

- 4e036a3: - Fixed a bug in rendering of non-previewable attachments not having an `sgid` or `url`
  - Fixed a bug in previewable attachments not having their height + width attached

## 0.8.3

### Patch Changes

- 486935e: - Fixed a bug where changing the `serializer` from HTML to JSON or vice-versa did not update the input element

## 0.8.2

### Patch Changes

- fdae042: - Fix a regression in attachment rendering

## 0.8.1

### Patch Changes

- 09e403f: - Fixed a conflict where ActiveStorage attachments not bound via custom attachments (like Mentions via TipTap extension) would get parsed by RhinoEditor by ignoring `contentType="application/octet-stream"` on attachments.
- cfe01a5: - Fixed a bug where progress bars showed on element with `sgid` on them.
  - Fixed a recursive issue with `setUploadProgress()`

## 0.8.0

### Minor Changes

- a315ebe: BREAKING_CHANGE: CSS parts have changed slightly to create a more consistent naming conventions. `toolbar-tooltip` has been renamed to `toolbar__tooltip` along with other parts being slightly modified. `link-dialog__add-link` changed to
  `link-dialog__link`.
- a315ebe: - BREAKING_CHANGE: `handleFiles` now no longer automatically chains events. Instead now it returns the attachmentManagers to be chained.

### Patch Changes

- a315ebe: - The editor no longer inserts `<p>` tags above and below an attachment
  - `<figure>` now has a default margin of `0.6em 0` to align with Trix.
  - Updated to role-components v2.0.1
  - Added docs on styling the border of the toolbar
- a315ebe: - Fixed CSS for attachment galleries
- a315ebe: - Added the ability to press the "Enter" key inside a `<figcaption>` and end up on the next line.
- a315ebe: - Fixed a bug with dropcursor not showing
- 6190d0b: Dependencies: update role-component to v2.0.0
- a315ebe: - Fixed a bug where pressing backspace inside a `<figcaption>` or a Gallery would cause the attachment to no longer be in the gallery

## 0.7.1

### Patch Changes

- f51bf37: fix: add `addExtensions` api to editor
- f51bf37: starterKitOptions and extensions no longer implement getters / setters, and are now direct instance variables
- f51bf37: - Dependencies: remove unnecessary `@tiptap/extensions-text-align` dependency.
  - Dependencies: downgrade and pin prosemirror-view from `1.31.2` to `1.28.2` to fix and error with adding plugins. <https://github.com/ueberdosis/tiptap/issues/4065#issuecomment-1699232591>

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
