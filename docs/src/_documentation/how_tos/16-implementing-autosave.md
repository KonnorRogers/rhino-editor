---
title: Implementing Autosave
permalink: /how-tos/implementing-autosave/
---

Big thank you to Seth Addison for the initial code for this.

Implementing autosave can be done a number of ways.

```js
// controllers/rhino_autosave_controller.js
import { Controller } from "@hotwired/stimulus";

// https://dev.to/jeetvora331/throttling-in-javascript-easiest-explanation-1081
function throttle(mainFunction, delay) {
  let timerFlag = null; // Variable to keep track of the timer

  // Returning a throttled version
  return (...args) => {
    if (timerFlag === null) { // If there is no timer currently running
      mainFunction(...args); // Execute the main function
      timerFlag = setTimeout(() => { // Set a timer to clear the timerFlag after the specified delay
        timerFlag = null; // Clear the timerFlag to allow the main function to be executed again
      }, delay);
    }
  };
}
export default class RhinoAutosave extends Controller {
  initialize() {
    // Throttle to avoid too many requests in a short time. This will save the editor at most 1 time every 300ms. Feel free to tune this number to better handle your workloads.
    this.handleEditorChange = throttle(this.handleEditorChange.bind(this), 300)
  }

  connect() {
    // "rhino-change" fires everytime something in the editor changes.
    this.element.addEventListener(
      "rhino-change",
      this.handleEditorChange
    ); // Listen for rhino-change
  }

  disconnect() {
    this.element.removeEventListener(
      "rhino-change",
      this.handleEditorChange
    );
  }

  handleEditorChange() {
    // Don't need to await. We're not relying on the response.
    this.submitForm()
  }


  async submitForm() {
    const form = this.element.closest("form");
    const formData = new FormData(form);

    try {
      const response = await fetch(form.getAttribute("action"), {
        // Its technically a "PATCH", but Rails will sort it out for us by using the `form_with`
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]').content,
        },
      });

      if (!response.ok) {
        const json = await response.json()
        const errors = json["errors"]
        // Decide how you want to use errors here, if at all.
        console.error("Auto-save failed", errors);
      } else {
        console.log("Auto-save successful");
      }
    } catch (error) {
      // This is usually a network error like a user losing connection, and not a 404 / 500 / etc.
      console.error("Error in auto-save", error);
    }
  }
}
```

This assume you have a DOM like the following:

```erb
<%%= form_with model: @model do %>
  <rhino-editor data-controller="rhino-autosave"></rhino-editor>
<%% end %>
```

You'll also need your controller to respond to JSON, something like the following:

```rb
class PostsController < ApplicationController
  def update
    @post = Post.find(params[:id])
    if @post.update(post_params)
      respond_to do |fmt|
        fmt.html { redirect_to @post }
        fmt.json { render json: {}, status: 200 }
      end
    else
      respond_to do |fmt|
        fmt.html { render :edit, status: 422 }
        fmt.json { render json: { errors: @post.errors.full_messages }, status: 422 } }
      end
    end
  end

  private

  def post_params
    # We assume your model is something like `has_rich_text :content`
    params.require(:post).permit(:content)
  end
end
```

With the above, "autosave" should start working for you! (And if it doesn't please open an issue and I'd be happy to take a look!)
