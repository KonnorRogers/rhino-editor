# config/initializers/actiontext_patch.rb
ActiveSupport.on_load(:after_initialize) do
    if !ActionText::ContentHelper.allowed_tags
      ActionText::ContentHelper.allowed_tags = ["iframe"]
    else
      ActionText::ContentHelper.allowed_tags << "iframe"
    end

  ActionText::TrixAttachment::ATTRIBUTES << "alt"
  ActionText::Attachment::ATTRIBUTES << "alt"
end
