class Alert < Bridgetown::Component
  ICONS = {
    primary: "info-circle",
    success: "check2-circle",
    info: "gear",
    warning: "exclamation-triangle",
    danger: "exclamation-octagon"
  }.freeze

  def initialize(type: :info, title: nil)
    @type = type.to_sym
    @title = title

    raise ArgumentError("#{@type} is not a valid type.") unless ICONS.key?(@type)

    @icon = ICONS[@type]
  end

  def title
    return if @title.nil?

    "<strong>#{@title}</strong><br>".html_safe
  end
end
