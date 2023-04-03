require "application_system_test_case"

class AttachmentAttributesTest < ApplicationSystemTestCase
  def setup
    page.goto(root_path)
    assert page.text_content("h2").include?("TipTap Editor")

    @file_name = "view-layer-benchmarks.png"
    attach_images(file_fixture(@file_name).to_s)
  end

  def rhino_editor_element
    page.locator("rhino-editor")
  end

  def rhino_editor_figure
    figure = page.locator("rhino-editor figure.attachment.attachment--preview.attachment--png[sgid]")
    figure.wait_for(timeout: 5)
    figure
  end

  def rhino_editor_image
    page.locator("rhino-editor img[width='2880']")
  end

  def trix_image
    page.locator("trix-editor img[width='2880']")
  end

  def trix_element
    page.locator("trix-editor")
  end

  def trix_figure
    page.locator("trix-editor figure.attachment.attachment--preview.attachment--png")
  end

  def attach_images(files)
    figure = nil
    while figure.nil?
      rhino_editor = page.expect_file_chooser do
        # hacky workaround because clicking the button that clicks the input[type="file"] doesnt actually work.
        page.locator("rhino-editor #file-input").evaluate("node => node.click()")
      end
      rhino_editor.set_files(files)

      figure = rhino_editor_figure
    end

    trix = page.expect_file_chooser do
      page.locator(".trix-button--icon-attach").click
    end
    trix.set_files(files)
  end

  test "Attachment Attributes" do
    figure_attributes = ["data-trix-content-type"]
    figure_attributes.each { |str| assert_equal rhino_editor_figure[str], trix_figure[str] }

    rhino_editor_attachment_attrs = JSON.parse(rhino_editor_figure["data-trix-attachment"])
    trix_attachment_attrs = JSON.parse(trix_figure["data-trix-attachment"])

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

    rhino_editor_attributes = JSON.parse(rhino_editor_figure[attributes])
    trix_attributes = JSON.parse(trix_figure[attributes])

    assert_match rhino_editor_attributes["presentation"], trix_attributes["presentation"]
  end

  test "Image attributes" do
    assert_equal rhino_editor_image["width"], trix_image["width"]
    assert_equal rhino_editor_image["height"], trix_image["height"]
  end
end
