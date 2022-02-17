class FrontendController < ActionController::Base
  def index
    render file: "public/index.html"
  end
end
