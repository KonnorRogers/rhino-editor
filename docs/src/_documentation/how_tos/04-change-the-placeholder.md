---
title: Change the placeholder
permalink: /how-tos/change-the-placeholder/
---

Perhaps you read the [Setup](tutorials/setup) sections that describe modifying the
default behavior of the `starterKitOptions`. While you could do the following to modify the placeholder:

<%= render Syntax.new("js") do %>
import "rhino-editor/exports/styles/trix.css"
import { TipTapEditor } from "rhino-editor/exports/elements/tip-tap-editor"

class ExtendedEditor extends TipTapEditor {
  constructor () {
    super()
    this.starterKitOptions = {
      ...super.starterKitOptions
      rhinoPlaceholder: {
        placeholder: "modified placeholder"
      }
    }
  }
}
<% end %>

there is actually an easier way if you're only looking to change the placeholder text
and dont need any additional hooks into the placeholder extension.

<%= render Syntax.new("js") do %>
import "rhino-editor/exports/styles/trix.css"
import { TipTapEditor } from "rhino-editor/exports/elements/tip-tap-editor"

class ExtendedEditor extends TipTapEditor {
  constructor () {
    super()
    this.translations = Object.assign(super.translations, {
      placeholder: "Modified placeholder"
    })
  }
}
<% end %>
