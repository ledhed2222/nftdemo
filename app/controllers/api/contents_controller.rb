module Api
  class ContentsController < ApplicationController
    def create
      render json: Content.create!(
        title: params[:title],
        payload: params[:payload],
      )
    end

    def exists?
      if Content.exists?(params[:id])
        head :ok
      else
        head :not_found
      end
    end
  end
end
