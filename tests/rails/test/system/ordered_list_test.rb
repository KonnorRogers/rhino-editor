require "application_system_test_case"

class AttachmentAttributesTest < ApplicationSystemTestCase
  def setup
    page.goto(root_path)
    assert page.text_content("h2").include?("TipTap Editor")
  end
end


