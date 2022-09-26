require "test_helper"

# 'capybara' need to be defined for EvilSystems to work properly.
require 'capybara'
require 'evil_systems'
require 'playwright'

class CapybaraNullDriver < Capybara::Driver::Base
  def needs_server?
    true
  end

  def save_screenshot(arg)
    # no-op
  end
end

ENV["APP_HOST"] = ENV.fetch("APP_HOST", "0.0.0.0")
Capybara.register_driver(:null) { CapybaraNullDriver.new }
EvilSystems.initial_setup

module Playwright
  class Page
    def save_screenshot(...)
      true
    end
  end
end

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :null

  def before_setup
    super
    page
  end

  def after_teardown
    super
    browser.close
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
    @page ||= context.new_page
  end

  def browser
    @browser ||= self.class.playwright.playwright.chromium.launch(headless: false)
  end

  def context(base_url = nil)
    # Gotta do some debugging here around urls.
    @context ||= browser.new_context(baseURL: base_url || Capybara.current_session.server.base_url.gsub("0.0.0.0", "localhost"))
  end

end
