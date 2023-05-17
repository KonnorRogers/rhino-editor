require 'json'
require "nokogiri"

class Builders::Helpers < SiteBuilder
  def build
    helper "version_number", :version_number
    helper "render_svg", :render_svg
    # All pages in "_documentation"
    helper "doc_collection", :doc_collection

    # Categories are top level in "_documentation"
    #   "_documentation/how_tos", "how_tos" is a category
    helper "ordered_categories", :ordered_categories
    helper "ordered_categories_hash_map", :ordered_categories_hash_map

    helper "docs_without_indexes", :docs_without_indexes
    helper "docs_in_category", :docs_in_category
    helper "indexed_docs_by_category", :indexed_docs_by_category

    helper "on_github", :on_github

    helper "next_page_in_category", :next_page_in_category
    helper "previous_page_in_category", :previous_page_in_category
    helper "current_page_in_category_index", :current_page_in_category_index
  end

  def render_svg(filename, options = {})
    image = site.static_files.find { |f| f.relative_path == "/#{filename}.svg" }

    return unless image

    file = File.read(image.path)
    doc = ::Nokogiri::HTML::DocumentFragment.parse file
    svg = doc.at_css 'svg'

    options.each { |attr, value| svg[attr.to_s] = value }

    doc.to_html.html_safe
  end

  def doc_collection
    site.collections[:documentation].resources
  end

  def ordered_categories
    doc_collection.uniq { |c| c.data[:category] }.sort_by { |c| c.data[:category_order] }
  end

  def ordered_categories_hash_map
    ordered_categories.map do |c|
      {
        category: c.data[:category],
        url: ::Bridgetown::Utils.slugify(c.data[:category]),
        text: c.data[:category].split("_").map(&:capitalize).join(" ")
      }
    end
  end

  def docs_without_indexes
    doc_collection.reject { |doc| doc.data.layout == "index" }
  end

  def docs_in_category(category)
    docs_without_indexes.select { |doc| doc.data.categories.include?(category) }
  end

  def indexed_docs_by_category(category)
    docs_in_category(category).sort_by { |doc| doc.data.slug }
  end

  def on_github(resource)
    branch = ENV["GITHUB_REF_NAME"] || site.metadata.default_branch
    site.metadata.github_url + "/tree/#{branch}/#{site.metadata.doc_location}/#{resource.relative_path}"
  end

  def version_number
    is_ci = ENV["GITHUB_REF_NAME"] != ""

    if is_ci && ENV["GITHUB_REF_NAME"] == "main"
      return "main"
    end

    if !is_ci && `git rev-parse --abbrev-ref HEAD`.chomp == "main"
      return "main"
    end

    package_json_file = File.join(File.expand_path("../../../", __dir__), "package.json")

    return unless File.exist?(package_json_file)

    package_json = File.read(package_json_file)
    JSON.parse(package_json)["version"].to_s
  end

  def next_page_in_category(resource, category = resource.data[:category])
    current_page_index = current_page_in_category_index(resource)

    return nil if current_page_index.nil?

    indexed_docs_by_category(category)[current_page_index + 1]
  end

  def previous_page_in_category(resource, category = resource.data[:category])
    current_page_index = current_page_in_category_index(resource)

    return nil if current_page_index.nil? || current_page_index == 0

    indexed_docs_by_category(category)[current_page_index - 1]
  end

  def current_page_in_category_index(resource, category = resource.data[:category])
    indexed_docs_by_category(category).index(resource)
  end
end

