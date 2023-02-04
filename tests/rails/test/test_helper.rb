ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"
require "minitest/reporters"
require "minitest/reporters/pride_reporter"
require "minitest/retry"

Minitest::Retry.use!(
  retry_count: Integer(ENV.fetch("RETRY", 2)),         # The number of times to retry. The default is 3.
  verbose: true,           # Whether or not to display the message at the time of retry. The default is true.
  io: $stdout,             # Display destination of retry when the message. The default is stdout.
  exceptions_to_retry: [], # List of exceptions that will trigger a retry (when empty, all exceptions will).
  methods_to_retry:    []  # List of methods that will trigger a retry (when empty, all methods will).
)
options = ENV["REPORTER"].to_s.downcase == "slow" ? {fast_fail: true, slow_count: 5} : {}
Minitest::Reporters.use!([Minitest::Reporters::PrideReporter.new(options)])

class ActiveSupport::TestCase
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
end
