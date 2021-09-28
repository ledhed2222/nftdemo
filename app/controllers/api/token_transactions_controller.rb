module Api
  class TokenTransactionsController < ApplicationController
    def create
      TokenTransaction.create!(
        token_id: params[:token_id],
        payload: params[:payload],
      )
      head :ok
    end
  end
end
