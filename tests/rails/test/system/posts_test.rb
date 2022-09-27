require "application_system_test_case"

class PostsTest < ApplicationSystemTestCase
  setup do
    @post = posts(:one)
  end

  test "visiting the index" do
    visit(posts_path)
    assert page.locator("h1").text_content.include? "Posts"
  end

  test "should create post" do
    visit(posts_path)
    page.locator("text=New post").click

    page.locator("##{@post.form_id(:title)}").fill(@post.title)
    page.locator("text=Create Post").click

    assert page.locator("text=Post was successfully created")

    page.locator("text=Back").click
    assert page.locator("text=New post")
  end

  test "should update Post" do
    visit post_path(@post)

    page.locator("text=Edit this post").click
    page.locator("##{@post.form_id(:title)}").fill(@post.title)
    page.locator("text=Update Post").click

    assert page.locator("text=Post was successfully updated")
    page.locator("text=Back").click
  end

  test "should destroy Post" do
    visit post_path(@post)

    page.locator("text=Destroy this post").click

    assert page.locator("text=Post was successfully destroyed")
  end
end
