class Post < ApplicationRecord
  has_rich_text :body

  include ActionText::Attachable

  def to_attachable_partial_path
    "action_text/remote_image"
  end
end
