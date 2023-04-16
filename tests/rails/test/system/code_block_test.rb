require "application_system_test_case"

class CodeBlockTest < ApplicationSystemTestCase
  def setup
    page.goto(root_path)
    assert page.text_content("h2").include?("TipTap Editor")
  end

  def code_block_button(str = "")
    page.locator("rhino-editor [part~='toolbar__button--code-block']#{str}")
  end

  test "Should have aria-pressed when pressed" do
    code_block_button.click
    locator = code_block_button("[aria-pressed='true'][part~='toolbar__button--active']")
    # locator.wait_for

    assert locator.visible?
  end
end


