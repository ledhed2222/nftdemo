module Api
  class TokensController < ApplicationController
    def index
      # we need to eagerly load the content to avoid N+1
      render json: Token.all.includes(:content)
    end

    def show
      render json: Token.find(params[:id])
    end

    def create
      Token.create(
        payload: params[:payload],
        content_id: params[:content_id],
        token_id: params[:token_id],
      )
      head :ok
    end

    def destroy
      Token.find(params[:id]).destroy!
      head :ok
    end
  end
end
