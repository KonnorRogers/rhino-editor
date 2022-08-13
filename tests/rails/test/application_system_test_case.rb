require "test_helper"

# 'capybara' and 'capybara/cuprite' need to be defined for EvilSystems to work properly.
require 'capybara'
# require 'capybara/cuprite'
require 'evil_systems'

class ApplicationSystemTestCase < ActionDispatch::SystemTestCase
  driven_by :selenium, using: ENV.fetch("BROWSER", :headless_chrome).to_sym, screen_size: [1400, 1400]

  include EvilSystems::Helpers

  def get_attributes(node, *attrs)
    attribute_script = <<~JAVASCRIPT
      (function(){
        var result = {};
        for (var i = arguments.length; i--; ) {
          var property_name = arguments[i];
          result[property_name] = this.getAttribute(property_name);
        }
        return result;
      }).apply(this, arguments)
    JAVASCRIPT

    attrs = attrs.flatten.map(&:to_s)
    raise ArgumentError, 'You must specify at least one attribute' if attrs.empty?

    begin
      node.evaluate_script(attribute_script, *attrs)
    rescue Capybara::NotSupportedByDriverError
      raise e
    end
  end
end
