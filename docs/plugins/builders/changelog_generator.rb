class Builders::ChangelogGenerator < SiteBuilder
  def build
    hook :site, :post_read do
      generate_changelog
    end

    hook :site, :post_reload do
      generate_changelog
    end
  end

  def generate_changelog
    changelog_file = File.expand_path("../../../CHANGELOG.md", __dir__)
    add_resource :documentation, "references/00-changelog.md" do
      title "Changelog"
      permalink "/references/changelog/"
      category "references"
      layout "doc"
      content File.read(changelog_file)
    end
  end
end


