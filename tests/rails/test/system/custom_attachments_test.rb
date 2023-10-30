require "application_system_test_case"

class CustomAttachmentsTest < ApplicationSystemTestCase
  def setup
    page.goto(posts_path)
    assert page.text_content("h1").include?("Posts")
    wait_for_network_idle
  end

  test "Should properly insert a custom attachment" do
    page.get_by_role('link', name: /New Post/i).click

    page.locator("rhino-editor").get_by_role("button", name: /Embed/i).click

    def check
      assert page.locator("rhino-editor figure.attachment").nth(0).wait_for(state: 'visible')
    end

    check

    # Save the attachment, make sure we render properly.
    page.get_by_role('button', name: /Create Post/i).click

    assert page.get_by_text("Post was successfully created")

    check

    # Go back and edit the file and make sure it renders properly in editor
    page.get_by_role('link', name: /Edit this post/i).click

    assert page.get_by_text("Editing post")

    check

    # Go back and edit the file and make sure it renders properly in editor
    page.get_by_role('link', name: /Show this post/i).click
    page.get_by_role('link', name: /Edit raw post/i).click
    assert page.get_by_text("Editing raw post")
    check
  end
end
