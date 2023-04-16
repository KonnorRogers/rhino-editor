require "application_system_test_case"

class BulletListTest < ApplicationSystemTestCase
  def setup
    page.goto(root_path)
    assert page.text_content("h2").include?("TipTap Editor")
  end

  def bullet_list_button(str = "")
    page.locator("rhino-editor [part~='toolbar__button--bullet-list']#{str}")
  end

  test "Should have aria-pressed when pressed" do
    bullet_list_button.click
    locator = bullet_list_button("[aria-pressed='true'][part~='toolbar__button--active']")
    # locator.wait_for

    assert locator.visible?
  end
end

