class ContentsController < ApplicationController
  def exists?
    if Content.exists?(params[:id])
      head :ok
    else
      head :not_found
    end
  end
end
