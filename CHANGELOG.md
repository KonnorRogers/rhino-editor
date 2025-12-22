# Changelog

## 0.18.1

### Patch Changes

- [#311](https://github.com/KonnorRogers/rhino-editor/pull/311) [`3310333`](https://github.com/KonnorRogers/rhino-editor/commit/3310333fb078bba120c656eb0f466c0cf92ffd8f) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fix exportparts missing commas, and fixed a slot name that was repeated twice

## 0.18.0

### Minor Changes

- [#300](https://github.com/KonnorRogers/rhino-editor/pull/300) [`08de93c`](https://github.com/KonnorRogers/rhino-editor/commit/08de93cc3158318cc5570aae7da390f4dc914a99) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Dependencies: Upgrade TipTap to v3.4 from v2.7

- [#300](https://github.com/KonnorRogers/rhino-editor/pull/300) [`08de93c`](https://github.com/KonnorRogers/rhino-editor/commit/08de93cc3158318cc5570aae7da390f4dc914a99) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - BREAKING_CHANGE: "rhinoImage" and "rhinoAttachment" extensions have been removed due to changes in TipTap 3

- [#300](https://github.com/KonnorRogers/rhino-editor/pull/300) [`08de93c`](https://github.com/KonnorRogers/rhino-editor/commit/08de93cc3158318cc5570aae7da390f4dc914a99) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - BREAKING_CHANGE: `history` renamed to `undoRedo` because of TipTap upgrade

### Patch Changes

- [#300](https://github.com/KonnorRogers/rhino-editor/pull/300) [`08de93c`](https://github.com/KonnorRogers/rhino-editor/commit/08de93cc3158318cc5570aae7da390f4dc914a99) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Dependencies: Upgrade `@rails/activestorage` to 8.0

## 0.17.3

### Patch Changes

- [#299](https://github.com/KonnorRogers/rhino-editor/pull/299) [`8ed419e`](https://github.com/KonnorRogers/rhino-editor/commit/8ed419ec9501463bdd8c39e39c0384c76ce89d65) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Bug Fix: More bug fixes with nbsp and `<br>`, should align close to Trix.

- [#299](https://github.com/KonnorRogers/rhino-editor/pull/299) [`8ed419e`](https://github.com/KonnorRogers/rhino-editor/commit/8ed419ec9501463bdd8c39e39c0384c76ce89d65) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Bug fix: Fix a bug with alt text editor on firefox

## 0.17.2

### Patch Changes

- [#296](https://github.com/KonnorRogers/rhino-editor/pull/296) [`b68ecf8`](https://github.com/KonnorRogers/rhino-editor/commit/b68ecf8c94e44538fb89c49df97ed122abfa84a5) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Bug Fix: Fixed a bug with preserving spaces causing images to get cleared and tables to break.

## 0.17.1

### Patch Changes

- [#293](https://github.com/KonnorRogers/rhino-editor/pull/293) [`a69a4a8`](https://github.com/KonnorRogers/rhino-editor/commit/a69a4a800a971f0abf24504f255b1711928c7172) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Bug fix: empty `<p>` tags and whitespace are now handled equivalent to Trix.

- [#293](https://github.com/KonnorRogers/rhino-editor/pull/293) [`a69a4a8`](https://github.com/KonnorRogers/rhino-editor/commit/a69a4a800a971f0abf24504f255b1711928c7172) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Bug Fix: Fixed a bug in the `getHTMLContentFromRange()` method on `<rhino-editor>`

## 0.17.0

### Minor Changes

- [#286](https://github.com/KonnorRogers/rhino-editor/pull/286) [`ed38117`](https://github.com/KonnorRogers/rhino-editor/commit/ed3811774a2d580e7fb1aa04b5cfd9156f362b42) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Add `main__toolbar` to the main toolbar to differentiate from the bubble menu

## 0.16.8

### Patch Changes

- [#283](https://github.com/KonnorRogers/rhino-editor/pull/283) [`4195ef4`](https://github.com/KonnorRogers/rhino-editor/commit/4195ef428f529badcf28d78775438af844c89885) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fix a bug in selection tracking causing unexpected behavior

## 0.16.7

### Patch Changes

- [#280](https://github.com/KonnorRogers/rhino-editor/pull/280) [`ab315ef`](https://github.com/KonnorRogers/rhino-editor/commit/ab315ef0f6df07f3a125787dfa06022efd88bf3c) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Set efault list-type for ol to decimal to align with Trix

## 0.16.6

### Patch Changes

- [#274](https://github.com/KonnorRogers/rhino-editor/pull/274) [`37dc045`](https://github.com/KonnorRogers/rhino-editor/commit/37dc04515a4f7b6f2d424050738e97ad3b365810) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fixed a bug where the `svg` selector was being applied to the whole page.

## 0.16.5

### Patch Changes

- [#268](https://github.com/KonnorRogers/rhino-editor/pull/268) [`608dab9`](https://github.com/KonnorRogers/rhino-editor/commit/608dab97d76a213b522c0f87c420eba85e88852e) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - fixed paste to properly account for if other extensions handled it first

- [#266](https://github.com/KonnorRogers/rhino-editor/pull/266) [`9f94bc1`](https://github.com/KonnorRogers/rhino-editor/commit/9f94bc1bbc699e0ccb37db897fc3f0a4cb1afae7) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - add dialog part to the dialog in the alt text editor

## 0.16.4

### Patch Changes

- [#261](https://github.com/KonnorRogers/rhino-editor/pull/261) [`4086b5c`](https://github.com/KonnorRogers/rhino-editor/commit/4086b5cd8160a993a95238c6bb716a2bf892f052) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - fix an issue with double paste

## 0.16.3

### Patch Changes

- [#256](https://github.com/KonnorRogers/rhino-editor/pull/256) [`7e3e790`](https://github.com/KonnorRogers/rhino-editor/commit/7e3e79055bf73c3c68a67ab2dab303f4815d579c) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fix issues with paste extensions

- [#256](https://github.com/KonnorRogers/rhino-editor/pull/256) [`7e3e790`](https://github.com/KonnorRogers/rhino-editor/commit/7e3e79055bf73c3c68a67ab2dab303f4815d579c) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fix issues with attachment pasting

## 0.16.2

### Patch Changes

- [#251](https://github.com/KonnorRogers/rhino-editor/pull/251) [`4c19e0f`](https://github.com/KonnorRogers/rhino-editor/commit/4c19e0ff1d4fb990fc685ab1623ed05e34310c5e) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fix a bug with alt text editor where you could not change it to empty.

- [#251](https://github.com/KonnorRogers/rhino-editor/pull/251) [`4c19e0f`](https://github.com/KonnorRogers/rhino-editor/commit/4c19e0ff1d4fb990fc685ab1623ed05e34310c5e) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Add additional parts onto alt text editor elements

## 0.16.1

### Patch Changes

- [#248](https://github.com/KonnorRogers/rhino-editor/pull/248) [`390af06`](https://github.com/KonnorRogers/rhino-editor/commit/390af067210762d9678dbf3fc79ba558d948ef4a) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fix a bug with paste event happening twice

- [#248](https://github.com/KonnorRogers/rhino-editor/pull/248) [`390af06`](https://github.com/KonnorRogers/rhino-editor/commit/390af067210762d9678dbf3fc79ba558d948ef4a) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fix attachment and html pasting to behave like it should have all along

## 0.16.0

### Minor Changes

- [`d0edd19`](https://github.com/KonnorRogers/rhino-editor/commit/d0edd19c6d9480c6b727edb9202018955f1c42c6) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Add an optional alt text editor

### Patch Changes

- [`d0edd19`](https://github.com/KonnorRogers/rhino-editor/commit/d0edd19c6d9480c6b727edb9202018955f1c42c6) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Remove unnecessary placeholder styles

## 0.15.0

### Minor Changes

- [#243](https://github.com/KonnorRogers/rhino-editor/pull/243) [`d71e2db`](https://github.com/KonnorRogers/rhino-editor/commit/d71e2db5bab0f6abcd54c0e171b207113c19b91c) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Add exportmaps to appease JSPM for importmaps

## 0.14.3

### Patch Changes

- [#240](https://github.com/KonnorRogers/rhino-editor/pull/240) [`9922d58`](https://github.com/KonnorRogers/rhino-editor/commit/9922d584df3fca76960a1a603a169c2c597a0bce) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fix: Remove the cursor placeholder for inserting links due to regressions in mobile browsers.

## 0.14.2

### Patch Changes

- [#237](https://github.com/KonnorRogers/rhino-editor/pull/237) [`1c395c5`](https://github.com/KonnorRogers/rhino-editor/commit/1c395c55a1ac867f7c8ac8387acf570ff5bac925) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fix pendingAttachments not clearing attachments that get cancelled

## 0.14.1

### Patch Changes

- [#231](https://github.com/KonnorRogers/rhino-editor/pull/231) [`01dbfbf`](https://github.com/KonnorRogers/rhino-editor/commit/01dbfbf01a421fe07f38ac005c2073f900c03ad8) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fix the hacky workaround for slow / unstable connections

- [#231](https://github.com/KonnorRogers/rhino-editor/pull/231) [`01dbfbf`](https://github.com/KonnorRogers/rhino-editor/commit/01dbfbf01a421fe07f38ac005c2073f900c03ad8) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - remove unnecessary console.log

- [#230](https://github.com/KonnorRogers/rhino-editor/pull/230) [`588abba`](https://github.com/KonnorRogers/rhino-editor/commit/588abba117d2fe2257b874832c94a0a91d274362) Thanks [@bjhess](https://github.com/bjhess)! - Fix the UX of link insertions

## 0.14.0

### Minor Changes

- [#227](https://github.com/KonnorRogers/rhino-editor/pull/227) [`924d0ff`](https://github.com/KonnorRogers/rhino-editor/commit/924d0ffe176c7a987d5c625b49f72645d580c255) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Added a "faux selection" for link insertions to give a visual indicator of insertion / replacement points for links.

- [#227](https://github.com/KonnorRogers/rhino-editor/pull/227) [`924d0ff`](https://github.com/KonnorRogers/rhino-editor/commit/924d0ffe176c7a987d5c625b49f72645d580c255) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Add a `rhino-editor.css` which is a more minimal `trix.css` and has no styles on the editor content.

### Patch Changes

- [#227](https://github.com/KonnorRogers/rhino-editor/pull/227) [`924d0ff`](https://github.com/KonnorRogers/rhino-editor/commit/924d0ffe176c7a987d5c625b49f72645d580c255) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fixed a bug around "progress" finishing prematurely

- [#227](https://github.com/KonnorRogers/rhino-editor/pull/227) [`924d0ff`](https://github.com/KonnorRogers/rhino-editor/commit/924d0ffe176c7a987d5c625b49f72645d580c255) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fixed a bug with direct upload events not dispatching under the proper name

## 0.13.2

### Patch Changes

- [#220](https://github.com/KonnorRogers/rhino-editor/pull/220) [`5fcb5ac`](https://github.com/KonnorRogers/rhino-editor/commit/5fcb5aca2f8e6b99eb419badfd5bfabe017a8bab) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fixed a CSS bug with inline code

- [#220](https://github.com/KonnorRogers/rhino-editor/pull/220) [`5fcb5ac`](https://github.com/KonnorRogers/rhino-editor/commit/5fcb5aca2f8e6b99eb419badfd5bfabe017a8bab) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fixed link dialogs not showing when the selection is not in view

## 0.13.1

### Patch Changes

- [`61241c0`](https://github.com/KonnorRogers/rhino-editor/commit/61241c0d9706b1ccfe6857853730876e047f08b0) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fix some bugs around prosemirror-view versioning

## 0.13.0

### Minor Changes

- [#216](https://github.com/KonnorRogers/rhino-editor/pull/216) [`0031ec1`](https://github.com/KonnorRogers/rhino-editor/commit/0031ec1b8f939593724460e7929d531bd5c29ab7) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Styles: blockquote has had its icon changed to represent a block code icon.

- [#216](https://github.com/KonnorRogers/rhino-editor/pull/216) [`0031ec1`](https://github.com/KonnorRogers/rhino-editor/commit/0031ec1b8f939593724460e7929d531bd5c29ab7) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Styling of link dialogs has changed now that it follows the selection cursor.

- [#216](https://github.com/KonnorRogers/rhino-editor/pull/216) [`0031ec1`](https://github.com/KonnorRogers/rhino-editor/commit/0031ec1b8f939593724460e7929d531bd5c29ab7) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fix: code blocks now properly display their correct keybinding

- [#216](https://github.com/KonnorRogers/rhino-editor/pull/216) [`0031ec1`](https://github.com/KonnorRogers/rhino-editor/commit/0031ec1b8f939593724460e7929d531bd5c29ab7) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Feature: Added an "inline code" toolbar button, bubble menu buttons, and default styles.

- [#216](https://github.com/KonnorRogers/rhino-editor/pull/216) [`0031ec1`](https://github.com/KonnorRogers/rhino-editor/commit/0031ec1b8f939593724460e7929d531bd5c29ab7) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Feature: Link dialogs now follow your selection cursor instead of always being in the top left of the editor

### Patch Changes

- [#216](https://github.com/KonnorRogers/rhino-editor/pull/216) [`0031ec1`](https://github.com/KonnorRogers/rhino-editor/commit/0031ec1b8f939593724460e7929d531bd5c29ab7) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fix: behavior around cursors with inline-code using Codemark plugin.

- [#216](https://github.com/KonnorRogers/rhino-editor/pull/216) [`0031ec1`](https://github.com/KonnorRogers/rhino-editor/commit/0031ec1b8f939593724460e7929d531bd5c29ab7) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fix: links now properly render inside of `<figcaption>`

- [#216](https://github.com/KonnorRogers/rhino-editor/pull/216) [`0031ec1`](https://github.com/KonnorRogers/rhino-editor/commit/0031ec1b8f939593724460e7929d531bd5c29ab7) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fix: double error extension registration has been fixed

- [#216](https://github.com/KonnorRogers/rhino-editor/pull/216) [`0031ec1`](https://github.com/KonnorRogers/rhino-editor/commit/0031ec1b8f939593724460e7929d531bd5c29ab7) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fix: keybindings now swap to using "option" instead of "alt" for iOS / MacOS.

## 0.12.0

### Minor Changes

- [#205](https://github.com/KonnorRogers/rhino-editor/pull/205) [`f4c64a7`](https://github.com/KonnorRogers/rhino-editor/commit/f4c64a7f67c16e66b9ccc7588be1804e172349d7) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Feature: Added the `determineNodeViewAnchor` to the bubble menu extension

- [#205](https://github.com/KonnorRogers/rhino-editor/pull/205) [`f4c64a7`](https://github.com/KonnorRogers/rhino-editor/commit/f4c64a7f67c16e66b9ccc7588be1804e172349d7) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Feature: Add the `defer-initialize` attribute for more reliable initialization events.

### Patch Changes

- [#205](https://github.com/KonnorRogers/rhino-editor/pull/205) [`f4c64a7`](https://github.com/KonnorRogers/rhino-editor/commit/f4c64a7f67c16e66b9ccc7588be1804e172349d7) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Bug fix: bubble menu will now anchor the `<figcaption>` or an attachment.

- [#205](https://github.com/KonnorRogers/rhino-editor/pull/205) [`f4c64a7`](https://github.com/KonnorRogers/rhino-editor/commit/f4c64a7f67c16e66b9ccc7588be1804e172349d7) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Style fix: attachments without previews no longer have weird empty border lines

- [#205](https://github.com/KonnorRogers/rhino-editor/pull/205) [`f4c64a7`](https://github.com/KonnorRogers/rhino-editor/commit/f4c64a7f67c16e66b9ccc7588be1804e172349d7) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Bug Fix: no longer generate an empty `<img>` for non-previewable attachments.

## 0.11.0

### Minor Changes

- [#199](https://github.com/KonnorRogers/rhino-editor/pull/199) [`7de4762`](https://github.com/KonnorRogers/rhino-editor/commit/7de4762741b5e6bb1e6ed01493aa6932a83b5ca1) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Added `rhinoBubbleMenu` to the default list of extensions.

- [#199](https://github.com/KonnorRogers/rhino-editor/pull/199) [`7de4762`](https://github.com/KonnorRogers/rhino-editor/commit/7de4762741b5e6bb1e6ed01493aa6932a83b5ca1) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Feature: Added some CSS fallbacks for dark color schemes

- [#199](https://github.com/KonnorRogers/rhino-editor/pull/199) [`7de4762`](https://github.com/KonnorRogers/rhino-editor/commit/7de4762741b5e6bb1e6ed01493aa6932a83b5ca1) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Feature: added events for direct upload in the form of `rhino-direct-upload:*`, you can read more in the editor events section.

- [#201](https://github.com/KonnorRogers/rhino-editor/pull/201) [`0611c16`](https://github.com/KonnorRogers/rhino-editor/commit/0611c16a209a909a6ed6f37f2cfc26f0b97e2124) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Update package versions

- [#199](https://github.com/KonnorRogers/rhino-editor/pull/199) [`7de4762`](https://github.com/KonnorRogers/rhino-editor/commit/7de4762741b5e6bb1e6ed01493aa6932a83b5ca1) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Feature: added the `rhino-update` event. Useful for tracking when the component has updated.

### Patch Changes

- [#199](https://github.com/KonnorRogers/rhino-editor/pull/199) [`7de4762`](https://github.com/KonnorRogers/rhino-editor/commit/7de4762741b5e6bb1e6ed01493aa6932a83b5ca1) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Feature: Added the `rhino-update` event for tracking updates to the editor

- [#199](https://github.com/KonnorRogers/rhino-editor/pull/199) [`7de4762`](https://github.com/KonnorRogers/rhino-editor/commit/7de4762741b5e6bb1e6ed01493aa6932a83b5ca1) Thanks [@KonnorRogers](https://github.com/KonnorRogers)! - Fixed a bug where rhino editor would not find inputs if loaded in the shadow dom

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
