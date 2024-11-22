---
title: Fake Selections and Insertions
permalink: /references/fake-selections/
---

Rhino Editor has a couple of utilities for having "fake" insertions and selections.

You'll notice as of v0.14.0 when you move focus to the link dialog inputs, the editor will either show a fake insertion cursor, or show a fake selection "box" around the currently selected text.

There's also a fake cursor used for inline code blocks courtesy of the [Codemark Plugin](https://github.com/curvenote/editor/tree/main/packages/prosemirror-codemark)

The CSS for these fake selections comes directly from `"rhino-editor/exports/styles/trix.css"`.

However, some people may not use this because it can be overly opinionated. Fake selections / cursors can also be added to a CSS file via:

`@import "rhino-editor/exports/styles/rhino-editor.css"`

or from a JavaScript file:

`import "rhino-editor/exports/styles/rhino-editor.css"`

