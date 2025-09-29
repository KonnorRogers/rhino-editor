require "application_system_test_case"

class AttachmentWithNoFigcaption < ApplicationSystemTestCase
  def attach_files(files)
    rhino_editor = page.expect_file_chooser do
      page.locator("rhino-editor slot[name='toolbar'] [part~='toolbar__button--attach-files']").first.click
    end

    files = [files] if !files.is_a?(Array)
    files = files.map { |file| file_fixture(file).to_s }

    rhino_editor.set_files(files)
  end

  test "Should not have a figcaption" do
    page.goto(new_post_path)
    wait_for_network_idle
    assert page.text_content("h1").include?("New post")
    page.evaluate_handle(<<~JAVASCRIPT
      () => new Promise(async (resolve) => {
        await customElements.whenDefined("rhino-editor")
        const rhinoEditor = document.querySelector('rhino-editor')
        await rhinoEditor.updateComplete
        rhinoEditor.starterKitOptions = {
          ...rhinoEditor.starterKitOptions,
          rhinoFigcaption: false
        }
        await rhinoEditor.updateComplete
        setTimeout(() => {
          resolve()
        })
      })
    JAVASCRIPT
    )

    file_name = "view-layer-benchmarks.png"
    attach_files(file_name)

    wait_for_network_idle

    page.locator("figure.attachment").nth(0).wait_for(state: "visible")   # check the attachment was added
    assert_equal page.locator("figure.attachment").count, 1

    # make sure the figcaption isn't
    assert_equal page.locator("figcaption").count, 0
  end

  test "Should have a figcaption" do
    page.goto(new_post_path)
    wait_for_network_idle
    assert page.text_content("h1").include?("New post")
    file_name = "view-layer-benchmarks.png"
    attach_files(file_name)

    wait_for_network_idle

    page.locator("figure.attachment").nth(0).wait_for(state: "visible")   # check the attachment was added
    assert_equal page.locator("figure.attachment").count, 1

    # make sure the figcaption isn't
    page.locator("figure.attachment figcaption").nth(0).wait_for(state: "visible")   # check the attachment was added
    assert_equal page.locator("figcaption").count, 1
  end
end
