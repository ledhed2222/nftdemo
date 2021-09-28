module Api
  class TokensController < ApplicationController
    def index
      # we need to eagerly load the content to avoid N+1
      relation = Token.all.includes(:content)
      if params[:owner]
        relation = relation.where(owner: params[:owner])
      else
        relation = relation.where(burned: false)
      end
      render json: relation
    end

    def show
      token = Token.find_by(content_id: params[:content_id])
      render json: {
        **token.as_json,
        content: token.content,
        transactions: token.token_transactions.order(created_at: :asc),
      }
    end

    def create
      Token.new(
        content_id: params[:content_id],
        xrpl_token_id: params[:token_id],
        owner: params[:owner],
        uri: params[:uri],
      ).token_transactions.build(
        payload: params[:payload],
      ).save!
      head :ok
    end

    def burn
      Token.find_by(id: params[:id]).update!(burned: true)
      head :ok
    end

    def change_owner
      Token.find_by(id: params[:id]).update!(owner: params[:owner])
      head :ok
    end
  end
end
