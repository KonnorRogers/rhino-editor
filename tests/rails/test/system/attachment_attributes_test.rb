require "application_system_test_case"

class Selenium::WebDriver::ShadowRoot
  def tag_name
    "shadow-root"
  end
end

class AttachmentAttributesTest < ApplicationSystemTestCase
  def setup
    visit root_path
    assert_selector "h2", text: "TipTap Editor"

    @file_name = "view-layer-benchmarks.png"
    attach_images(file_fixture(@file_name))
  end

  def tip_tap_element
    find("tip-tap-element")
  end

  def tip_tap_figure
    tip_tap_element.shadow_root.find("figure.attachment.attachment--preview.attachment--png")
  end

  def trix_element
    find("trix-editor")
  end

  def trix_figure
    trix_element.find("figure.attachment.attachment--preview.attachment--png")
  end

  def attach_images(file)
    tip_tap_element.shadow_root.find("#file-input", visible: false).attach_file(file)

    page.attach_file(file) do
      find(".trix-button--icon-attach").click
    end
  end

  test "Attachment Attributes" do
    figure_attributes = ["class", "data-trix-content-type"]
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

    blob_path = rails_service_blob_path(":signed_id", ":filename").split(":signed_id")[0]
    assert_match /#{blob_path}\S+\//, tip_tap_attachment_attrs["url"]
    refute_nil tip_tap_attachment_attrs["sgid"]

    # Trix-attributes
    attributes = "data-trix-attributes"

    tip_tap_attributes = JSON.parse(tip_tap_figure[attributes])
    trix_attributes = JSON.parse(trix_figure[attributes])

    assert_match tip_tap_attributes["presentation"], trix_attributes["presentation"]
  end

  test "Image attributes" do
    tip_tap_img = tip_tap_element.shadow_root.find("img")
    trix_img = trix_element.find("img")

    assert_equal get_attributes(tip_tap_img, "width"), get_attributes(trix_img, "width")
    assert_equal get_attributes(tip_tap_img, "height"), get_attributes(trix_img, "height")
  end
end
