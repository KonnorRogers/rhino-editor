require "application_system_test_case"

class AttachmentAttributesTest < ApplicationSystemTestCase
  def rhino_editor_element
    page.locator("rhino-editor").first
  end

  def rhino_editor_figure
    page.locator("rhino-editor figure[data-trix-attachment][sgid]").first
  end

  def rhino_editor_png_figure
    page.locator("rhino-editor figure.attachment.attachment--preview.attachment--png[sgid]").first
  end

  def rhino_editor_image
    page.locator("rhino-editor img[width='2880']").first
  end

  def trix_image
    page.locator("trix-editor img[width='2880']").first
  end

  def trix_element
    page.locator("trix-editor").first
  end

  def trix_png_figure
    page.locator("trix-editor figure.attachment.attachment--preview.attachment--png")
  end

  def attach_files(files)
    rhino_editor = page.expect_file_chooser do
      page.locator("rhino-editor slot[name='toolbar'] [part~='toolbar__button--attach-files']").first.click
    end
    rhino_editor.set_files(files)

    trix = page.expect_file_chooser do
      page.locator(".trix-button--icon-attach").first.click
    end
    trix.set_files(files)
  end

  def setup
    page.goto(posts_path)
    assert page.text_content("h1").include?("Posts")
  end

  test "Attachment Attributes" do
    page.get_by_role('link', name: /New Post/i).click

    @file_name = "view-layer-benchmarks.png"
    attach_files([file_fixture(@file_name).to_s])

    def attachment_attrs_test
      figure_attributes = ["data-trix-content-type"]

      figure_attributes.each { |str| assert_equal rhino_editor_png_figure[str], trix_png_figure[str] }

      rhino_editor_attachment_attrs = JSON.parse(rhino_editor_png_figure["data-trix-attachment"])
      trix_attachment_attrs = JSON.parse(trix_png_figure["data-trix-attachment"])

      comparable_attributes = [
        "filename",
        "contentType",
        "filesize",
        "height",
        "width"
      ]

      comparable_attributes.each do |attr|
        assert_equal rhino_editor_attachment_attrs[attr], trix_attachment_attrs[attr]
      end

      blob_path = rails_service_blob_path(":signed_id", ":filename")
      blob_path = blob_path.split(":signed_id")[0]
      assert_match /#{blob_path}\S+\//, rhino_editor_attachment_attrs["url"]
      refute_nil rhino_editor_attachment_attrs["sgid"]

      # Trix-attributes
      attributes = "data-trix-attributes"

      rhino_editor_attributes = JSON.parse(rhino_editor_png_figure[attributes])
      trix_attributes = JSON.parse(trix_png_figure[attributes])

      assert_match rhino_editor_attributes["presentation"], trix_attributes["presentation"]
    end

    attachment_attrs_test

    # Save the attachment, make sure we render properly.
    page.get_by_role('button', name: /Create Post/i).click

    assert page.get_by_text("Post was successfully created")

    attachment_attrs_test

    # Go back and edit the file and make sure it renders properly in editor
    page.get_by_role('link', name: /Edit this post/i).click
    assert page.get_by_text("Editing post")

    attachment_attrs_test

    # Go back and edit the file and make sure it renders properly in editor
    # page.get_by_role('link', name: /Show this post/i).click
    # page.get_by_role('link', name: /Edit raw post/i).click
    # assert page.get_by_text("Editing raw post")
    # attachment_attrs_test
  end

  test "Image attributes" do
    page.get_by_role('link', name: /New Post/i).click

    @file_name = "view-layer-benchmarks.png"
    attach_files([file_fixture(@file_name).to_s])

    assert_equal rhino_editor_image["width"], trix_image["width"]
    assert_equal rhino_editor_image["height"], trix_image["height"]
  end

  test "Non previewable assets" do
    page.get_by_role('link', name: /New Post/i).click

    @file_name = "addresses.csv"
    attach_files([file_fixture(@file_name).to_s])

    def check_attrs
      rhino_editor_attachment_attrs = JSON.parse(rhino_editor_figure["data-trix-attachment"])

      refute rhino_editor_attachment_attrs["url"].blank?
      refute rhino_editor_attachment_attrs["sgid"].blank?
    end

    check_attrs

    # Save the attachment, make sure we render properly.
    page.get_by_role('button', name: /Create Post/i).click

    assert page.get_by_text("Post was successfully created")

    check_attrs

    # Go back and edit the file and make sure it renders properly in editor
    page.get_by_role('link', name: /Edit this post/i).click
    assert page.get_by_text("Editing post")

    check_attrs

    # Go back and edit the file and make sure it renders properly in editor
    page.get_by_role('link', name: /Show this post/i).click
    page.get_by_role('link', name: /Edit raw post/i).click
    assert page.get_by_text("Editing raw post")
    check_attrs
  end
end
