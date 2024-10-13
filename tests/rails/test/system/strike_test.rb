require "application_system_test_case"

class StrikeTest < ApplicationSystemTestCase
  def setup
    page.goto(root_path)
    assert page.text_content("h2").include?("TipTap Editor")
  end

  def strike_button(str = "")
    page.locator("rhino-editor slot[name='toolbar'] [part~='toolbar__button--strike']#{str}")
  end


  test "Should have aria-pressed when pressed" do
    strike_button.click
    locator = strike_button("[aria-pressed='true'][part~='toolbar__button--active']")

    assert locator.visible?
  end
end
