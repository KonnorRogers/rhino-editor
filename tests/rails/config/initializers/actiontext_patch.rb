# config/initializers/actiontext_patch.rb
ActiveSupport.on_load(:after_initialize) do
  if !ActionText::ContentHelper.allowed_tags
    # Issue here: https://github.com/rails/rails/issues/55667
    #   https://github.com/rails/rails/issues/54478#issuecomment-3287272036
    # with Rails 8.x (possibly 7.1.x?)
    ActionText::ContentHelper.allowed_tags = ["action-text-attachment", "img", "figure", "figcaption"]
  end

  ActionText::ContentHelper.allowed_tags << "iframe"

  ActionText::TrixAttachment::ATTRIBUTES << "alt"
  ActionText::Attachment::ATTRIBUTES << "alt"
end
