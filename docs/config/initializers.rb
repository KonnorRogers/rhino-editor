Bridgetown.configure do |config|
  config.url = ENV["URL"] || ENV["RELEASE_URL"] || "https://rhino-editor.vercel.app"
  config.base_path = ENV.fetch("BASE_PATH", "/")
  config.base_url = config.url + config.base_path
  config.base_path_with_trailing_slash = config.base_path.ends_with?("/") ? config.base_path : config.base_path + "/"
  config.base_path_no_trailing_slash = config.base_path.gsub(/\/$/, "")
  init :"bridgetown-quick-search"

  # init :ssr
  # init :"bridgetown-routes"
  # only :server do
  #   roda do |app|
  #     app.plugin :default_headers,
  #       'Content-Type'=>'text/html',
  #       'Strict-Transport-Security'=>'max-age=16070400;',
  #       'X-Content-Type-Options'=>'nosniff',
  #       'X-Frame-Options'=>'deny',
  #       'X-XSS-Protection'=>'1; mode=block',
  #       'Access-Control-Allow-Origin'=>'*'
  #   end
  # end
end
