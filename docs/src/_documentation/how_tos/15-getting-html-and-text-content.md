---
title: Getting HTML and Text content of the editor
permalink: /how-tos/getting-html-and-text-content/
---

Sometimes you may want to grab either a plain text representation or an HTML representation of Rhino Editor's content, or even the currently selected content.

Rhino Editor exposes 2 functions to help with this.

## getHTMLContentFromRange

The first is `getHTMLContentFromRange(from, to)` where `from` and `to` are `number`. They are optional. If no parameters are passed, it will read from the user's current selection.

### getHTMLContentFromRange examples

#### Getting the HTML content of the user's current selection

To get the HTML content of what the user has highlighted, you can do so by calling `getHTMLContentFromRange()` with no parameters. Like so:

```js
const rhinoEditor = document.querySelector("rhino-editor")
rhinoEditor.getHTMLContentFromRange()
```

#### Getting HTML content for a given range

Sometimes you may want to get the HTML content for a given range, to do so, pass in a `from` and `to` parameters that are a `number`. Like so:

```js
const rhinoEditor = document.querySelector("rhino-editor")
rhinoEditor.getHTMLContentFromRange(0, 50)
```

#### Getting selected content and falling back to full editor content

Sometimes you may want to get the current selection of the user, or fall back to the entire editor's HTML if the user has not selected anything. To do so, we can conditionally check if the `getHTMLContentFromRange()` is "empty". Like so:

```js
const rhinoEditor = document.querySelector("rhino-editor")
let html = rhinoEditor.getHTMLContentFromRange()

// If the user has nothing currently highlighted, fallback to getting the full HTML of the editor.
if (!html) {
  html = rhinoEditor.editor.getHTML()
}
```

## getTextContentFromRange

`getTextContentFromRange()` has much the same API as `getHTMLContentFromRange()`. You can either pass 2 numbers as a range, or you can pass nothing it will return the user's currently selected text. Let's look at the previous example but instead now grabbing text.

### getTextContentFromRange examples

#### Getting the text content of the user's current selection

To get the Text content of what the user has highlighted, you can do so by calling `getTextContentFromRange()` with no parameters. Like so:

```js
const rhinoEditor = document.querySelector("rhino-editor")
rhinoEditor.getTextContentFromRange()
```

#### Getting Text content for a given range

Sometimes you may want to get the Text content for a given range, to do so, pass in a `from` and `to` parameters that are a `number`. Like so:

```js
const rhinoEditor = document.querySelector("rhino-editor")
rhinoEditor.getTextContentFromRange(0, 50)
```

#### Getting selected content and falling back to full editor content

Sometimes you may want to get the current selection of the user, or fall back to the entire editor's Text if the user has not selected anything. To do so, we can conditionally check if the `getTextContentFromRange()` is "empty". Like so:

```js
const rhinoEditor = document.querySelector("rhino-editor")
let text = rhinoEditor.getTextContentFromRange()

// If the user has nothing currently highlighted, fallback to getting the full Text of the editor.
if (!text) {
  text = rhinoEditor.editor.getText()
}
```

