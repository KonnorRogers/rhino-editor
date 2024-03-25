---
title: Getting Started
permalink: /tutorials/getting-started/
---

The first step to working with the Rhino Editor is installing it! There are 2 ways to install it.

You can either [install with npm](#install-with-npm) or [install with importmaps](#install-with-importmaps)

## Install with npm

<%= render Syntax.new("bash") do %>
npm install rhino-editor
<% end %>

After installing, we can import it in our project.

<%= render Syntax.new("js") do %>
// index.js
import "rhino-editor"
import "rhino-editor/exports/styles/trix.css"
<% end %>

The above will auto-register the `<rhino-editor>` element for you.
For more ways to initialize the editor, checkout the [Setup](/tutorials/setup) page.

### Manual importmaps installation

As of v2.x [importmaps-rails](https://github.com/rails/importmap-rails) vendors by default.
Unfortunately, the typical importmap flow doesn't work as expected with RhinoEditor. So,
here is a manual installation workaround until it gets fixed.

<%= render Alert.new(type: :danger) do %>
  Make sure to run the following commands at the root of your Rails project!
<% end %>

```bash
curl -Lo ./app/assets/stylesheets/rhino-editor.css https://unpkg.com/rhino-editor/cdn/styles/trix.css
curl -Lo ./vendor/javascript/rhino-editor.js https://unpkg.com/rhino-editor/exports/bundle/index.module.js

rm ./app/assets/stylesheets/actiontext.css
```

Then set the pin manually:

```diff
# config/importmap.rb
# ...
- pin "trix"
- pin "@rails/actiontext", to: "actiontext.esm.js"
+ pin "rhino-editor", to: "rhino-editor.js"
```

And then in your JS entrypoint, remove Trix + ActionText, and import rhino-editor.

```js
// app/javascript/application.js
// ...
- import "trix"
- import "@rails/actiontext"
+ import "rhino-editor"
```

<br>

## Usage

Finally, to see it appear on a page you can write the following HTML:

<%= render Syntax.new("html") do %>
<rhino-editor></rhino-editor>
<% end %>

And you're on your way! But you're not done yet!

Head on over to [Setup](/tutorials/setup) for a more in-depth explanation of setting up the editor!

If you're using Rails, check out [Usage with Rails](/tutorials/usage-with-rails/)
