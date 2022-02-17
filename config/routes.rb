Rails.application.routes.draw do
  namespace :api do
    resources :token_transactions, only: [:create]

    resources :contents, only: [:create]

    get "/tokens/:content_id", to: "tokens#show"
    patch "/tokens/:id/burn", to: "tokens#burn"
    patch "/tokens/:id/change_owner", to: "tokens#change_owner"
    resources :tokens, only: [:index, :create]

    delete "/sessions", to: "sessions#destroy"
    resources :sessions, only: [:create] 

    get "/xumm/:id", to: "xumm#show"
    post "/xumm", to: "xumm#create"
  end

  match "/tokens/:id", to: "contents#exists?", via: [:head]

  get "*path", to: "frontend#index", constraints: -> (req) {
    !req.xhr? && req.format.html?
  }
end
