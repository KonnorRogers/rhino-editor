require "cgi"

class Builders::Inspectors < SiteBuilder
  def build
    inspect_html do |document|
      grab_headers(document)
      mark_external(document)
      syntax_highlight(document)
      wrap_light_code(document)
    end
  end

  def mark_external(document)
    document.css("a[href^='http']").each do |anchor|
      next unless anchor[:href]&.starts_with?("http") && !anchor[:href].to_s.include?(site.config.url)

      anchor[:target] = "_blank"
      anchor[:rel] = "nofollow noopener noreferrer"

      next if anchor.css("external-icon")[0]
      next if anchor[:"no-external-icon"]

      anchor << " <external-icon></external-icon>"
    end
  end

  def wrap_light_code(document)
    document.css("light-code").each do |el|
      lang = el["language"].to_s === "" ? "html" : el["language"]
      lang = Syntax.full_language(lang)
      id = el["id"] || "code-block-" + SecureRandom.uuid
      el["id"] = id

      el.wrap("<div class='syntax-block'></div>")

      actions = <<-HTML
        <div class='syntax-block__actions'>
          <div class='syntax-block__badge'>
            #{lang}
          </div>

          <sl-tooltip content="Copy">
            <button
              for='#{id}'
              class='button clipboard clipboard--idle syntax-block__clipboard'
              aria-label='Copy to clipboard'
              data-controller='clipboard'
              type="button"
            >
              <sl-icon class='clipboard__icon--success' name='clipboard-check'></sl-icon>
              <sl-icon class='clipboard__icon--idle' name='clipboard'></sl-icon>
            </button>
          </sl-tooltip>
        </div>
      HTML

      el.add_previous_sibling(actions)
    end
  end

  def syntax_highlight(document)
    document.css("div.highlighter-rouge").each do |el|
      text = el.inner_text
      lang = el["class"].scan(/\s?language-.*\s/).last

      lang = lang.strip.split("-")[1] if lang

      lang = Syntax.full_language(lang)
      id = "code-block-" + SecureRandom.uuid

      el.wrap("<div class='syntax-block'></div>")

      actions = <<-HTML
        <div class='syntax-block__actions'>
          <div class='syntax-block__badge'>
            #{lang}
          </div>

          <sl-tooltip content="Copy">
            <clipboard-copy
              for='#{id}'
              class='button clipboard clipboard--idle syntax-block__clipboard'
              aria-label='Copy to clipboard'
              data-controller='clipboard'
            >
              <sl-icon class='clipboard__icon--success' name='clipboard-check'></sl-icon>
              <sl-icon class='clipboard__icon--idle' name='clipboard'></sl-icon>
            </clipboard-copy>
          </sl-tooltip>

          <script type="text/plain" id='#{id}' hidden>#{CGI.escape_html(text)}</script>
        </div>
      HTML

      el.add_previous_sibling(actions)
    end
  end

  def grab_headers(document)
    table_of_contents = document.css(".doc #table-of-contents ol")[0]
    mobile_menu = document.css(".side-nav--mobile .side-nav__menu")[0]

    # This isn't great. but works for my case :shrug:
    document.css("main").css("h2[id],h3[id],h4[id],h5[id],h6[id]").each do |heading|
      text = heading.inner_text

      unless heading.css("a")[0]
        heading.content = ""
        anchor = %(
          <a href='##{heading[:id]}'>#{text}</a>
        )

        heading << anchor
      end


      side_anchor = %(
        <a href='##{heading[:id]}' class='side-nav__link'>#{text}</a>
      )

      item = document.create_element("li", "", class: "side-nav__item")
      item << side_anchor

      table_of_contents << item

      # we'll get here.
      # list = document.create_element("ul", "", class: "side-nav__category-menu")
      # list << item
      # mobile_menu.before list
    end
  end
end
