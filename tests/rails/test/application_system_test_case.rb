# test/application_system_test_case.rb
require "test_helper"
require "playwright"
require "fileutils"

class CapybaraNullDriver < Capybara::Driver::Base
  def needs_server?
    true
  end
end

ENV["APP_HOST"] = ENV.fetch("APP_HOST", "0.0.0.0")
Capybara.register_driver(:null) { CapybaraNullDriver.new }
EvilSystems.initial_setup(task: "build:all", silent: false)
VIDEO_DIR = ENV.fetch("PLAYWRIGHT_VIDEOS", Rails.root.join("tmp/playwright/videos"))
SCREENSHOTS_DIR = ENV.fetch("PLAYWRIGHT_SCREENSHOTS", Rails.root.join("tmp/playwright/screenshots"))

# Rails ScreenshotHelper uses this.
Capybara.save_path = SCREENSHOTS_DIR

module Playwright
  class Page
    # This allows us to take screenshots on failures.
    def save_screenshot(path, **options)
      screenshot(path: path)
    end
  end
end

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :null

  def before_setup
    super
    # This is the basename which will be like `MyTest__test_it_does_the_thing` used for videos.
    @file_basename = "#{self.class.to_s.gsub(/\W+/, "-")}__#{name}"
    page
  end

  def after_teardown
    super
    browser.close

    if @failures.length > 0
      # Give it a nice filename to find if it did fail.
      new_video_path = File.join(VIDEO_DIR, @file_basename + ".webm")
      FileUtils.mkdir_p(File.dirname(new_video_path))
      FileUtils.mv(@video_path, new_video_path)
      puts "[Video saved]: #{new_video_path}"
    else
      # dont need the video if it passes
      FileUtils.rm_f(@video_path)
    end
  end

  def self.playwright
    @playwright ||= Playwright.create(playwright_cli_executable_path: Rails.root.join("node_modules/.bin/playwright"))
  end

  def visit(location, **options)
    opts = options || {}
    opts[:waitUntil] = opts.fetch(:waitUntil, 'networkidle')
    page.goto(location, **opts)
  end

  def wait_for_network_idle
    page.wait_for_load_state(state: 'networkidle')
  end

  def page
    @page ||= page_context.new_page
    @video_path = @page.video.path
    @page
  end

  def browser
    @browser ||= self.class.playwright.playwright.chromium.launch(headless: ENV["CI"] == "true")
  end

  def page_context(base_url = nil)
    # Gotta do some debugging here around urls.
    @page_context ||= browser.new_context(baseURL: base_url || Capybara.current_session.server.base_url.gsub("0.0.0.0", "localhost"), record_video_dir: VIDEO_DIR)
  end

  def pause
    @page.pause
  end
end
