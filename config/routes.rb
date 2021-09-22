Rails.application.routes.draw do
  namespace :api do
    resources :contents, only: [:show, :create]
    resources :tokens, only: [:index, :show, :create, :destroy]
  end

  match "/tokens/:id", to: "api/contents#exists?", via: [:head]
  get "*path", to: "application#frontend_index_html"
end
