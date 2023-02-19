# Changelog

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
