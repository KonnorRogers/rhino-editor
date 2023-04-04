---
title: Serialize to JSON
permalink: /how-tos/serialize-to-json/
---

Perhaps you have no interest in using the default ActionText implementation, and are
instead looking to serialize / deserialize JSON. This
can be done by rendering the editor with `serializer="json"`


```html
<input id="content" name="content">
<rhino-editor input="content" serializer="json">
</rhino-editor>
```

## Caveats

The above is an advanced use-case and is not generally recommended.

When using this approach, you will have to handle the following:

1. Setting up a table for the JSON to be stored
1. ActiveStorage items. They will be direct uploaded, but to query for ActiveStorage items, you will be in charge of that.
1. Rendering the JSON when not within the editor.

