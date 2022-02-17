module Api
  class ContentsController < ApplicationController
    def create
      render json: Content.create!(
        title: params[:title],
        payload: params[:payload],
      )
    end
  end
end
