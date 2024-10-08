require "application_system_test_case"

class AttachmentGalleriesTest < ApplicationSystemTestCase
  def attach_files(files)
    rhino_editor = page.expect_file_chooser do
      page.locator("rhino-editor slot[name='toolbar'] [part~='toolbar__button--attach-files']").first.click
    end

    files = files.map { |file| file_fixture(file).to_s }

    rhino_editor.set_files(files)
  end

  def setup
    page.goto(posts_path)
    assert page.text_content("h1").include?("Posts")
    wait_for_network_idle
  end

  test "Should allow to insert multiple attachments in the gallery in sequence" do
    page.get_by_role('link', name: /New Post/i).click


    files = [
      "screenshot-1.png",
    ]

    attach_files(files)

    files = [
      "screenshot-2.png",
    ]

    attach_files(files)

    files = [
      "screenshot-3.png",
    ]

    attach_files(files)

    def check
      wait_for_network_idle

      assert page.locator(".attachment-gallery > figure.attachment").nth(0).wait_for(state: "visible")
      assert page.locator(".attachment-gallery > figure.attachment").nth(1).wait_for(state: "visible")
      assert page.locator(".attachment-gallery > figure.attachment").nth(2).wait_for(state: "visible")

      assert_equal page.locator(".attachment-gallery > figure.attachment").count, 3
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
    wait_for_network_idle
    page.get_by_role('link', name: /Edit raw post/i).click
    assert page.get_by_text("Editing raw post")
    check
  end

  test "Should not allow to insert multiple attachments in the gallery at once" do
    page.get_by_role('link', name: /New Post/i).click


    files = [
      "screenshot-1.png",
      "addresses.csv"
    ]

    attach_files(files)

    def check
      wait_for_network_idle

      assert page.locator(".attachment-gallery > figure.attachment").nth(0).wait_for(state: "visible")
      assert page.locator("figure.attachment").nth(1).wait_for(state: "visible")

      assert_equal page.locator(".attachment-gallery > figure.attachment").count, 1
      assert_equal page.locator("figure.attachment").count, 2
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
    wait_for_network_idle
    page.get_by_role('link', name: /Edit raw post/i).click
    assert page.get_by_text("Editing raw post")
    check
  end

  test "Should not allow to insert multiple attachments in the gallery in sequence" do
    page.get_by_role('link', name: /New Post/i).click

    wait_for_network_idle


    files = [
      "screenshot-1.png",
    ]

    attach_files(files)

    files = [
      "addresses.csv"
    ]

    attach_files(files)

    def check
      wait_for_network_idle

      assert page.locator(".attachment-gallery > figure.attachment").nth(0).wait_for(state: 'visible')
      assert page.locator("figure.attachment").nth(1).wait_for(state: 'visible')

      assert_equal page.locator(".attachment-gallery > figure.attachment").count, 1
      assert_equal page.locator("figure.attachment").count, 2
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
    wait_for_network_idle
    page.get_by_role('link', name: /Edit raw post/i).click
    assert page.get_by_text("Editing raw post")
    check
  end
end
