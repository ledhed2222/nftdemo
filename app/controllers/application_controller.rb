class ApplicationController < ActionController::API
  def frontend_index_html
    public_file_path = Rails.root.join(params[:path])
    if public_file_path.exist?
      render file: public_file_path
    else
      render file: "public/index.html"
    end
  end
end
