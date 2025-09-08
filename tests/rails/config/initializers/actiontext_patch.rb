# config/initializers/actiontext_patch.rb
Rails.application.config.after_initialize do
    ActionText::TrixAttachment::ATTRIBUTES << "alt"
    ActionText::Attachment::ATTRIBUTES << "alt"
end
