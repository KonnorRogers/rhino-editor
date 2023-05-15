require "securerandom"

class Syntax < Bridgetown::Component
  LANGUAGES = {
    rb: "Ruby",
    js: "JavaScript",
    ts: "TypeScript",
    sh: "Shell",
    html: "HTML"
  }

  attr_accessor :language, :filename

  def initialize(language = "markup", filename = nil)
    super()
    @language = language
    @filename = filename
  end

  def filename_or_language
    filename || full_language
  end

  def full_language
    LANGUAGES[@language.to_sym] || @language.titleize
  end

  def id
    @id ||= "syntax-#{SecureRandom.uuid}"
  end
end
