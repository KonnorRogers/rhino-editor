require "application_system_test_case"

class AttachmentAttributesTest < ApplicationSystemTestCase
  COMPARABLE_ATTRIBUTES = %w[
    filename
    contentType
    filesize
    height
    width
  ].freeze

  def setup
    page.goto(new_post_path)
    @file_name = "view-layer-benchmarks.png"
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

  def tip_tap_attach_images(files)
    # Click something else. The file chooser doesnt like back-to-back clicks.
    page.locator("tip-tap-element slot[name='bold-button'] .toolbar__button").click

    tip_tap = page.expect_file_chooser do
      page.locator("tip-tap-element .toolbar__button--attach-files").click
    end

    tip_tap.set_files(files)
  end

  def trix_attach_images(files)
    trix = page.expect_file_chooser do
      page.locator(".trix-button--icon-attach").click
    end
    trix.set_files(files)
  end

  def attach_images(files)
    # Trix attachments must come before TipTap. No idea why.
    trix_attach_images(files)

    tip_tap_attach_images(files)
    tip_tap_figure
  end

  test "Attachment Attributes" do
    attach_images(file_fixture(@file_name).to_s)

    run_test

    page.get_by_role("button", name: /Create post/i).click
    page.get_by_role("link", name: /Edit this post/i).click

    # Recheck everything on page reload
    run_test

    # Reload page and check
    page.reload
    run_test

    # # Recheck without #to_trix_html
    page.get_by_role("button", name: /Update post/i).click
    page.get_by_role("link", name: /Edit raw post/i).click
    run_test

    # Double check with page reload
    page.reload
    run_test
  end

  def run_test
    figure_attributes = ["data-trix-content-type"]
    figure_attributes.each { |str| assert_equal tip_tap_figure[str], trix_figure[str] }

    tip_tap_attachment_attrs = JSON.parse(tip_tap_figure["data-trix-attachment"])
    trix_attachment_attrs = JSON.parse(trix_figure["data-trix-attachment"])

    COMPARABLE_ATTRIBUTES.each do |attr|
      assert_equal tip_tap_attachment_attrs[attr].to_s, trix_attachment_attrs[attr].to_s
    end

    blob_path = rails_service_blob_path(":signed_id", ":filename")
    blob_path = blob_path.split(":signed_id")[0]

    blob_regex = /#{blob_path}\S+\//

    assert_match(blob_regex, tip_tap_attachment_attrs["url"])
    refute_nil tip_tap_attachment_attrs["sgid"]

    image = page.locator("tip-tap-element img[src*='#{blob_path}']")
    assert_match(blob_regex, image["src"])

    assert_equal tip_tap_image["width"], trix_image["width"]
    assert_equal tip_tap_image["height"], trix_image["height"]

    # Trix-attributes
    attributes = "data-trix-attributes"

    tip_tap_attributes = JSON.parse(tip_tap_figure[attributes])
    trix_attributes = JSON.parse(trix_figure[attributes])

    assert_match tip_tap_attributes["presentation"], trix_attributes["presentation"]
  end
end
