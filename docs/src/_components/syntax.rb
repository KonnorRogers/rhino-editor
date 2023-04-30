class Syntax < Bridgetown::Component
  def initialize(language = "markup")
    super()
    @language = language
  end
end
