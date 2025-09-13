# config/initializers/actiontext_patch.rb
ActiveSupport.on_load(:after_initialize) do
  if !ActionText::ContentHelper.allowed_tags
    ActionText::ContentHelper.allowed_tags = ["iframe", "action-text-attachment"]
  else
    ActionText::ContentHelper.allowed_tags << "iframe"
    # Issue here: https://github.com/rails/rails/issues/55667
    # with Rails 8.x (possibly 7.1.x?)
    ActionText::ContentHelper.allowed_tags << "action-text-attachment"
  end

  ActionText::TrixAttachment::ATTRIBUTES << "alt"
  ActionText::Attachment::ATTRIBUTES << "alt"
end
