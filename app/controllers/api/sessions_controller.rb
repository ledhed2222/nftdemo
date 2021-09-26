module Api
  class SessionsController < ApplicationController
    def start
      render json: Xumm.sign_in_request
    end

    def create
      xumm_payload = Xumm.payload(params[:payload_id])
      account = xumm_payload.dig(:response, :account)
      user_token = xumm_payload.dig(:application, :issued_user_token)

      Session.find_or_initialize_by(
        account: account,
      ).update!(
        user_token: user_token,
      )

      render json: account
    end

    def destroy
      Session.destroy_by(account: cookies[:account])
      cookies.delete :account
      head :ok
    end
  end
end
