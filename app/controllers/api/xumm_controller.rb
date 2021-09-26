module Api
  class XummController < ApplicationController
    def show
      render json: Xumm.payload(params[:id])
    end

    def create 
      params[:payload].permit!
      render json: Xumm.submit_payload(
        params[:payload].to_h,
        user_token: Session.find_by(
          account: cookies[:account],
        )&.user_token,
      )
    end
  end
end
