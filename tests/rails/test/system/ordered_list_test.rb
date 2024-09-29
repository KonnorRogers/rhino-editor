require "application_system_test_case"

class OrderedListTest < ApplicationSystemTestCase
  def setup
    page.goto(root_path)
    assert page.text_content("h2").include?("TipTap Editor")
  end

  def ordered_list_button(str = "")
    page.locator("rhino-editor role-toolbar [part~='toolbar__button--ordered-list']#{str}")
  end

  test "Should have aria-pressed when pressed" do
    ordered_list_button.click
    locator = ordered_list_button("[aria-pressed='true'][part~='toolbar__button--active']")

    assert locator.visible?
  end
end


