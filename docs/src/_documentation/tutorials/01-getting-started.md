---
title: Getting Started
permalink: /tutorials/getting-started/
---

The first step to working with the Rhino Editor is installing it!

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

<br>

Finally, to see it appear on a page you can write the following HTML:

<%= render Syntax.new("html") do %>
<rhino-editor></rhino-editor>
<% end %>

And you're on your way! But you're not done yet!

Head on over to [Setup](/tutorials/setup) for a more in-depth explanation of setting up the editor!
