class YoutubeController < ApplicationController
  def show
    @youtube = Youtube.new(id: "dQw4w9WgXcQ")
    render json: {
      sgid: @youtube.attachable_sgid,
      content: render_to_string(partial: "youtubes/thumbnail", locals: { youtube: @youtube }, formats: [:html]),
      contentType: "application/vnd.active_record.user"
    }
  end
end
