ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"
require "minitest/reporters"
require "minitest/reporters/pride_reporter"
require "debug"

options = ENV["REPORTER"].to_s.downcase == "slow" ? {fast_fail: true, slow_count: 5} : {}
Minitest::Reporters.use!([Minitest::Reporters::PrideReporter.new(options)])

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
end
