require "application_system_test_case"

class BlockquoteTest < ApplicationSystemTestCase
  def setup
    page.goto(root_path)
    assert page.text_content("h2").include?("TipTap Editor")
  end

  def block_quote_button(str = "")
    page.locator("rhino-editor role-toolbar [part~='toolbar__button--blockquote']#{str}")
  end

  test "Should have aria-pressed when pressed" do
    block_quote_button.click
    locator = block_quote_button("[aria-pressed='true'][part~='toolbar__button--active']")

    assert locator.visible?
  end
end

