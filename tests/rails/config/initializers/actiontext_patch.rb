# config/initializers/actiontext_patch.rb
attributes = ActionText::TrixAttachment::ATTRIBUTES + ["alt"]
ActionText::TrixAttachment.const_set("ATTRIBUTES", attributes)

attributes = ActionText::Attachment::ATTRIBUTES + ["alt"]
ActionText::Attachment.const_set("ATTRIBUTES", attributes)
