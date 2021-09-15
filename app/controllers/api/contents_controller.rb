module Api
  class ContentsController < ApplicationController
    def index
      render json: Content.all
    end

    def show
      content = Content.find(params[:id])
      render json: {
        content: content,
        token: content.token,
      }
    end

    def create
      render json: Content.create(
        title: params[:title],
        payload: params[:payload],
      ).id
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
