require "application_system_test_case"

class HeadingTest < ApplicationSystemTestCase
  def setup
    page.goto(root_path)
    assert page.text_content("h2").include?("TipTap Editor")
  end

  def heading_button(str = "")
    page.locator("rhino-editor [part~='toolbar__button--heading']#{str}")
  end

  test "Should have aria-pressed when pressed" do
    heading_button.click
    locator = heading_button("[aria-pressed='true'][part~='toolbar__button--active']")

    assert locator.visible?
  end
end
