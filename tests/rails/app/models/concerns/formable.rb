module Formable
  ## Helpers for using non-standard form elements.

  # Shortcut for model.errors.full_messages_for(:thing).first
  # @param {#to_sym} method - The method to call +#full_messages_for+ on.
  # @return {String, nil} Return the first error on a given Model.
  def error_message(method)
    errors.full_messages_for(method.to_sym).first
  end

  # Generates a form id for a given Object + method
  # @param {Symbol} symbol - The attribute to call.
  # @return {String}
  # @example
  #   <% user = User.new %>
  #   <%= form_with model: user do %>
  #     <input id="<%= User.new.form_id(:first_name)" %>" name="user[first_name]" />
  #   <% end %>
  def form_id(symbol)
    "#{self.class.name.underscore}_#{symbol}"
  end

  # Generates a form name for a given Object + method
  # @param {Symbol} symbol - The attribute to call.
  # @return {String}
  # @example
  #   <% user = User.new %>
  #   <%= form_with model: user do %>
  #     <input id="user_first_name" name="<%= User.new.form_name(:first_name) %>" />
  #   <% end %>
  def form_name(symbol)
    "#{self.class.name.underscore}[#{symbol}]"
  end

  # Generates a form name for a given Object + method
  # @param {Symbol} symbol - The attribute to call.
  # @return {String}
  # @example
  #   <% user = User.new %>
  #   <%= form_with model: user do %>
  #     <input id="user_first_name" name="user[first_name]" value="<%= User.new.form_value(:first_name) %>" />
  #   <% end %>
  def form_value(symbol)
    self.public_send(symbol.to_sym)
  end

  # Generates an i18n value from the given model.
  # @param {Symbol} symbol - The attribute to call.
  # @return {String}
  # @example
  #   <% user = User.new %>
  #   <%= form_with model: user do %>
  #     <label for="user_first_name"><%= user.form_label(:first_name) %></label>
  #     <input id="user_first_name" name="user[first_name]" value="<%= user.form_value(:first_name) %>" />
  #   <% end %>
  def form_label(symbol)
    self.class.human_attribute_name(symbol)
  end

  # The string version of id, name, and value of an Object.
  # @param {Symbol} symbol - The attribute to call.
  # @return {String}
  # @example
  #   <sl-input <%= User.new.form_fields_string(:column) %>></sl-input>
  def form_fields_string(symbol)
    self.form_fields(symbol).map { |key, value| "#{key}='#{value}'" }.join(" ")
  end

  # The Hash version of id, name, and value of an Object.
  # @param {Symbol} symbol - The attribute to call.
  # @return {Hash{Symbol => String}}
  # @example
  #   <%= sl_tag "input", **User.new.form_fields(:column) %>
  def form_fields(symbol)
    {
      id: form_id(symbol),
      name: form_name(symbol),
      value: form_value(symbol),
      label: form_label(symbol),
      error: error_message(symbol),
    }
  end

  # A way to render checkbox attributes based on the boolean.
  # @return {"checked", ""}
  def checked_html(bool)
    bool ? "checked" : ""
  end
end
