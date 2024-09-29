require "application_system_test_case"

class ItalicTest < ApplicationSystemTestCase
  def setup
    page.goto(root_path)
    assert page.text_content("h2").include?("TipTap Editor")
  end

  def italic_button(str = "")
    page.locator("rhino-editor slot[name='toolbar'] [part~='toolbar__button--italic']#{str}")
  end

  test "Should have aria-pressed when pressed" do
    italic_button.click
    locator = italic_button("[aria-pressed='true'][part~='toolbar__button--active']")

    assert locator.visible?
  end
end
