class Syntax < Bridgetown::Component
  LANGUAGES = {
    rb: "Ruby",
    js: "JavaScript",
    ts: "TypeScript",
    sh: "Shell",
    html: "HTML"
  }

  def initialize(language = "markup", filename = nil)
    super()
    @language = language
    @filename = filename
  end

  def full_language_or_filename
    @filename || LANGUAGES[@language.to_sym] || @language.titleize
  end
end
