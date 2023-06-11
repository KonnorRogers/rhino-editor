class Builders::Inspectors < SiteBuilder
  def build
    inspect_html do |document|
      table_of_contents = document.css(".doc #table-of-contents ol")[0]

      if table_of_contents
        # This isn't great. but works for my case :shrug:
        document.css("main").css("h2[id],h3[id],h4[id],h5[id],h6[id]").each do |heading|
          text = heading.inner_text
          heading.content = ""
          anchor = %(
            <a href='##{heading[:id]}'>#{text}</a>
          )

          heading << anchor

          side_anchor = %(
            <a href='##{heading[:id]}' class='side-nav__link'>#{text}</a>
          )

          item = document.create_element("li", "", class: "side-nav__item")
          item << side_anchor

          table_of_contents << item
        end
      end
    end
  end
end
