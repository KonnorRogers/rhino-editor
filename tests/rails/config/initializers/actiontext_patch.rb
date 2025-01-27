# config/initializers/actiontext_patch.rb

# For some reason, "alt_text", "altText", and "alt-text" all get stripped. So we just use "alt"
attributes = ActionText::TrixAttachment::ATTRIBUTES + ["alt"]
ActionText::TrixAttachment.const_set("ATTRIBUTES", attributes)

attributes = ActionText::Attachment::ATTRIBUTES + ["alt"]
ActionText::Attachment.const_set("ATTRIBUTES", attributes)
