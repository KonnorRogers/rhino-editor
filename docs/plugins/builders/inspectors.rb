class Builders::Inspectors < SiteBuilder
  def build
    inspect_html do |document|
      table_of_contents = document.css(".doc #table-of-contents ol")[0]
      mobile_menu = document.css(".side-nav--mobile .side-nav__menu")[0]

      # This isn't great. but works for my case :shrug:
      document.css("main").css("h2[id],h3[id],h4[id],h5[id],h6[id]").each do |heading|
        unless heading.css("a")
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
end
