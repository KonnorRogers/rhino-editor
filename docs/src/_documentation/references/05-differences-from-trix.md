---
title: Differences from Trix
permalink: /references/differences-from-trix/
---

<%= render Alert.new(type: "primary") do %>
  This section is still in progress and incomplete. This will be a running list of differences, features,
  where Rhino has diverged, etc, from Trix.
<% end %>


## Custom Attachments

Custom Attachments in Rhino Editor must have a `content-type` set on them. To do this, go into the Model you are rendering and do the following:

```rb
class Mention < ApplicationRecord
  def attachable_content_type
    "application/vnd.active_record.mention"
  end
end
```

Or using an `ActiveModel::Model`

```rb
class Mention
  include ActiveModel::Model
  include ActiveModel::Attributes
  include GlobalID::Identification
  include ActionText::Attachable

  def attachable_content_type
    "application/vnd.active_record.mention"
  end
end
```

The reason for this is because sometimes you may want to render an ActiveStorage attachment from your server into
Rhino Editor, but don't want it to go through the default image processing, for example, Mentions.

This is an active choice to break backwards compatibility, but it's intended to allow for more powerful
interactions with custom extensions on TipTap.

For more context, check out this issue:

<https://github.com/KonnorRogers/rhino-editor/pull/112>
