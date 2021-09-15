Rails.application.routes.draw do
  namespace :api do
    resources :tokens, :contents, only: [:index, :show, :create]
  end

  match "/tokens/:id", to: "api/contents#exists?", via: [:head]
  get "*path", to: "application#frontend_index_html"
end
