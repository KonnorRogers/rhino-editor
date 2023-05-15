---
title: Why Rhino?
permalink: /references/why-rhino/
---

Trix provides a solid foundation to get started with WYSIWYG editing in Rails.
When you find yourself needing more power or extensibility, that's where Rhino comes in.

The goal of Rhino is to provide a drop-in replacement for Trix that allows
you to continue using ActionText, but be able to provide a more rich text editing
experience.

Rhino lets you do things like [Real Time Collaboration](references/real-time-collaboration),
[Code Syntax Highlighting](how-tos/syntax-highlighting), [Table Editing](how-tos/table-editing),
and much much more that isn't possible with Trix without significant wizardry. RhinoEditor uses
[TipTap](https://tiptap.dev) under the hood which gives powerful hooks into the editor schema allowing
you to build just about anything into your WYSIWYG.

Which leads to the next point. Because Rhino is built on top of TipTap / [ProseMirror](https://prosemirror.net)
you get full access to a wide collection of community plugins. You can drop in any ProseMirror or
TipTap extensions and they'll work with rhino-editor.

<https://tiptap.dev/extensions>

## Tradeoffs

The power and flexibility of Rhino comes at price. Because RhinoEditor is building on top of other packages,
it is quite a large package at around ~100kb gzipped. Comparitively, Trix is ~40kb gzipped.

RhinoEditor also makes use of Shadow DOM for things like the link insertion dialog and
the toolbar. If you're not familiar with Web Components and Shadow DOM, it may take some
getting used to. I'll do my best to provide examples of how to style / extend Rhino Editor
to fit your needs.
