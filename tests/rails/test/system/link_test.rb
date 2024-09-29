require "application_system_test_case"

class LinkTest < ApplicationSystemTestCase
  def setup
    page.goto(root_path)
    assert page.text_content("h2").include?("TipTap Editor")
  end

  def link_button(str = "")
    page.locator("rhino-editor role-toolbar [part~='toolbar__button--link']#{str}")
  end

  test "Should have aria-pressed when pressed" do
    link_button.click
    locator = link_button("[aria-pressed='true'][part~='toolbar__button--active']")

    assert locator.visible?
  end
end

