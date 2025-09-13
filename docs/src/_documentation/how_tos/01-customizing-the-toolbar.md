---
title: Customizing the toolbar
permalink: /how-tos/customizing-the-toolbar/
---

Rather than using JavaScript to define the toolbar like in Trix, Rhino Editor
takes the approach of slotting in HTML.

Heres an example of "slotting" in an embed button.

```html
<rhino-editor>
  <button
    type="button"
    slot="before-undo-button"
    class="rhino-toolbar-button"
    data-role="toolbar-item"
    tabindex="-1"
  >
    Embed
  </button>
</rhino-editor>
```

<rhino-editor>
  <button
    type="button"
    slot="before-undo-button"
    class="rhino-toolbar-button"
    data-role="toolbar-item"
    tabindex="-1"
  >
    Embed
  </button>
</rhino-editor>

<%= render Alert.new(type: :warning, title: "Note") do %>
  Make sure to add `type="button"` so that the buttons do not submit the form. Also make sure
  to add `data-role="toolbar-item"` to have the toolbar work correctly and `tabindex="-1"`.
<% end %>

<h2 id="understanding-slots">
  <a href="#understanding-slots">
    Understanding Slots
  </a>
</h2>

Each toolbar button has a number of corresponding slots. For example you have
`before-bold-button` slot which lets you insert something before the bold button.
There is a corresponding `after-bold-button` and theres also a `bold-button` slot
which lets you insert your own button.

<%= render Alert.new(type: :danger) do %>
  When overriding buttons in the toolbar, you are now in charge of adding functionality
  and accounting for accessibility.
<% end %>

<h2 id="changing-icons">
  <a href="#changing-icons">
    Changing Icons
  </a>
</h2>

Maybe you just want to change the icons and dont need to override the whole
toolbar or an entire button within the toolbar. That can be done by using the `*-icon`.

For example, here's how we would override the attachment button icon using an icon
from <https://tabler-icons.io>

<% text = %(
<rhino-editor>
  <svg slot="attach-files-icon" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-paperclip" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
   <path d="M15 7l-6.5 6.5a1.5 1.5 0 0 0 3 3l6.5 -6.5a3 3 0 0 0 -6 -6l-6.5 6.5a4.5 4.5 0 0 0 9 9l6.5 -6.5"></path>
  </svg>
</rhino-editor>
) %>

```html
<%= markdownify(text) %>
```

<%= text.html_safe %>

## Removing an item from the toolbar

To remove an item from the toolbar, find the `rhino-editor` element and then remove the extension.

Here's how we could do it using a `before-initialize` event listener to remove the "bold" button.

<% text = capture do %>
function removeBold () {
  const rhinoEditor = document.querySelector("rhino-editor#no-bold")

  if (rhinoEditor == null) return

  rhinoEditor.starterKitOptions = {
    ...rhinoEditor.starterKitOptions,
    bold: false
  }
}

document.addEventListener("rhino-before-initialize", removeBold)
<% end %>


```js
<%= text.chomp.html_safe %>
```

<script type="module">
  <%= text.chomp.html_safe %>
</script>

<rhino-editor id="no-bold"></rhino-editor>

Here are all the options available:

<!-- Would love a way to auto-generate this -->
```ts
{
  // These all come from TipTap's StarterKit.
  blockquote: Partial<BlockquoteOptions> | false;
  bold: Partial<BoldOptions> | false;
  bulletList: Partial<BulletListOptions> | false;
  code: Partial<CodeOptions> | false;
  codeBlock: Partial<CodeBlockOptions> | false;
  document: false;
  dropcursor: Partial<DropcursorOptions> | false;
  gapcursor: false;
  hardBreak: Partial<HardBreakOptions> | false;
  heading: Partial<HeadingOptions> | false;
  history: Partial<HistoryOptions> | false;
  horizontalRule: Partial<HorizontalRuleOptions> | false;
  italic: Partial<ItalicOptions> | false;
  listItem: Partial<ListItemOptions> | false;
  orderedList: Partial<OrderedListOptions> | false;
  paragraph: Partial<ParagraphOptions> | false;
  strike: Partial<StrikeOptions> | false;
  text: false;


  // These are all internal plugins to RhinoEditor.

  /** Enables attachment galleries */
  rhinoGallery: Partial<GalleryOptions> | false;

  /** Enables attachments */
  rhinoAttachment: Partial<AttachmentOptions> | false;

  /**
   * Replaces the default strike from TipTap's StarterKit and replaces it with `<del>` instead of `<s>`
   */
  rhinoStrike: Partial<StrikeOptions> | false;

  /**
   * A plugin for finding the currently focused element. Used by various CSS styles in the editor.
   */
  rhinoFocus: Partial<FocusOptions> | false;

  /**
   * Enables the link dialog
   */
  rhinoLink: Partial<LinkOptions> | false;

  /**
   * Enables & configures the placeholder you see for captions and for empty documents
   */
  rhinoPlaceholder: Partial<PlaceholderOptions> | false;

  /**
   * Sends a browser event called `rhino-paste-event` everytime a user pastes something into the document.
   */
  rhinoPasteEvent: Partial<PasteOptions> | false;

  increaseIndentation: boolean,
  decreaseIndentation: boolean
}
```
