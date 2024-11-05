---
title: Getting Started
permalink: /tutorials/getting-started/
---

The first step to working with the Rhino Editor is installing it! There are 2 ways to install it.

You can either [install with npm](#install-with-npm) or [install with importmaps](#manual-importmaps-installation)

## Install with npm

```bash
npm install rhino-editor
```

After installing, we can import it in our project.

```js
// index.js
import "rhino-editor"
import "rhino-editor/exports/styles/trix.css"
```

The above will auto-register the `<rhino-editor>` element for you.
For more ways to initialize the editor, checkout the [Setup](/tutorials/setup) page.

### Manual importmaps installation

As of v2.x [importmaps-rails](https://github.com/rails/importmap-rails) vendors by default.
Unfortunately, the typical importmap flow doesn't work as expected with RhinoEditor. So,
here is a manual installation workaround until it gets fixed.

<%= render Alert.new(type: :danger) do %>
  Make sure to run the following commands at the root of your Rails project!
<% end %>

First we'll start by pulling down the Trix CSS file, and the precompiled JS bundle.

CSS File: <https://unpkg.com/rhino-editor/exports/styles/trix.css>

JS File: <https://unpkg.com/rhino-editor/exports/bundle/index.module.js>

```bash
curl -Lo ./app/assets/stylesheets/rhino-editor.css https://unpkg.com/rhino-editor/exports/styles/trix.css
curl -Lo ./vendor/javascript/rhino-editor.js https://unpkg.com/rhino-editor/exports/bundle/index.module.js
# Remove actiontext css to avoid conflicts.
rm ./app/assets/stylesheets/actiontext.css
```

Once you have downloaded the files into `app/assets/stylesheets/rhino-editor.css` and
`vendor/javascript/rhino-editor.js`, the Rhino Editor CSS file will automatically be included in your stylesheets as part of the AssetPipeline.

To get the JavaScript portion to work, you need to modify your `config/importmap.rb` to point to the `rhino-editor.js`
vendored file. We can also remove the Trix + ActionText pins if you don't plan to use them. Like so:

```diff
# config/importmap.rb
# ...
- pin "trix"
- pin "@rails/actiontext", to: "actiontext.esm.js"
+ pin "rhino-editor", to: "rhino-editor.js"
```

And then in your `application.js`, we can do the same thing. Import Rhino Editor, remove Trix + ActionText.

```js
// app/javascript/application.js
// ...
- import "trix"
- import "@rails/actiontext"
+ import "rhino-editor"
```

And you should be ready to go!

<br>

## Usage

To see Rhino Editor appear on your page you can write the following HTML:

```html
<rhino-editor></rhino-editor>
```

And you're on your way! But you're not done yet!

Head on over to [Setup](/tutorials/setup) for a more in-depth explanation of setting up the editor!

If you're using Rails, check out [Usage with Rails](/tutorials/usage-with-rails/)
