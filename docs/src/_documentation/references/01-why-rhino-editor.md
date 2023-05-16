---
title: Why Rhino Editor?
permalink: /references/why-rhino-editor/
---

Rhino Editor is intended to be a drop-in replacement for Trix.
The current standard WYSIWYG editor for Rails.

Trix provides a solid foundation to get started with WYSIWYG editing in Rails.
When you find yourself needing more power or extensibility, that's where Rhino Editor comes in.

The goal of Rhino Editor is to provide a drop-in replacement for Trix that allows
you to continue using ActionText, but be able to provide a more rich text editing
experience.

Rhino Editor lets you do things like [Real Time Collaboration](references/real-time-collaboration),
[Code Syntax Highlighting](how-tos/syntax-highlighting), [Table Editing](how-tos/table-editing),
and much much more that isn't possible with Trix without significant wizardry. Rhino Editor uses
[TipTap](https://tiptap.dev) under the hood which gives powerful hooks into the editor schema allowing
you to build just about anything into your WYSIWYG.

Which leads to the next point. Because Rhino Editor is built on top of TipTap / [ProseMirror](https://prosemirror.net)
you get full access to a wide collection of community plugins. You can drop in any ProseMirror or
TipTap extensions and they'll work with Rhino Editor.

<https://tiptap.dev/extensions>

<h2 id="tradeoffs">
  <a href="#tradeoffs">
    Tradeoffs
  </a>
</h2>

The power and flexibility of Rhino Editor comes at a price.
Because Rhino Editor is built on top of other packages,
it is quite a large compared to Trix.

Rhino Editor is around `~100kb` gzipped. Trix however is `~40kb` gzipped.

Rhino Editor also makes use of Shadow DOM for things like the link insertion dialog and
the toolbar. If you're not familiar with Web Components and Shadow DOM, it may take some
getting used to. I'll do my best to provide examples of how to style / extend Rhino Editor
to fit your needs.
