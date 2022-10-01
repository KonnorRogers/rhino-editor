require "application_system_test_case"

class AttachmentAttributesTest < ApplicationSystemTestCase
  def setup
    page.goto(root_path)
    assert page.text_content("h2").include?("TipTap Editor")

    @file_name = "view-layer-benchmarks.png"
    attach_images(file_fixture(@file_name).to_s)
  end

  def tip_tap_element
    page.locator("tip-tap-element")
  end

  def tip_tap_figure
    page.locator("tip-tap-element figure.attachment.attachment--preview.attachment--png[sgid]")
  end

  def tip_tap_image
    page.locator("tip-tap-element img[width='2880']")
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

  def attach_images(file)
    tip_tap = page.expect_file_chooser do
      # hacky workaround because clicking the button that clicks the input[type="file"] doesnt actually work.
      page.locator("tip-tap-element #file-input").evaluate("node => node.click()")
    end
    tip_tap.set_files(file)

    trix = page.expect_file_chooser do
      page.locator(".trix-button--icon-attach").click
    end
    trix.set_files(file)
  end

  test "Attachment Attributes" do
    figure_attributes = ["data-trix-content-type"]
    figure_attributes.each { |str| assert_equal tip_tap_figure[str], trix_figure[str] }

    tip_tap_attachment_attrs = JSON.parse(tip_tap_figure["data-trix-attachment"])
    trix_attachment_attrs = JSON.parse(trix_figure["data-trix-attachment"])

    comparable_attributes = [
      "filename",
      "contentType",
      "filesize",
      "height",
      "width"
    ]

    comparable_attributes.each do |attr|
      assert_equal tip_tap_attachment_attrs[attr], trix_attachment_attrs[attr]
    end


    blob_path = rails_service_blob_path(":signed_id", ":filename")
    blob_path = blob_path.split(":signed_id")[0]
    assert_match /#{blob_path}\S+\//, tip_tap_attachment_attrs["url"]
    refute_nil tip_tap_attachment_attrs["sgid"]

    # Trix-attributes
    attributes = "data-trix-attributes"

    tip_tap_attributes = JSON.parse(tip_tap_figure[attributes])
    trix_attributes = JSON.parse(trix_figure[attributes])

    assert_match tip_tap_attributes["presentation"], trix_attributes["presentation"]
  end

  test "Image attributes" do
    assert_equal tip_tap_image["width"], trix_image["width"]
    assert_equal tip_tap_image["height"], trix_image["height"]
  end
end
