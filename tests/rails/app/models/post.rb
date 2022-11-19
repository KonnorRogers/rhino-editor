class Post < ApplicationRecord
  has_rich_text :tip_tap_body
  has_rich_text :trix_body

  # include ActionText::Attachable
  # def to_attachable_partial_path
  #   "action_text/remote_image"
  # end
end
