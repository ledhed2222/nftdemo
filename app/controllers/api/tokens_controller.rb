module Api
  class TokensController < ApplicationController
    def index
      # we need to eagerly load the content to avoid N+1
      render json: Token.all.includes(:content)
    end

    def show
      token = Token.find_by(content_id: params[:content_id])
      render json: {
        **token.as_json,
        content: token.content,
      }
    end

    def create
      Token.create!(
        payload: params[:payload],
        content_id: params[:content_id],
        token_id: params[:token_id],
        owner: params[:owner],
      )
      head :ok
    end

    def destroy
      Token.destroy_by(id: params[:id])
      head :ok
    end
  end
end
