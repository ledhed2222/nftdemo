Rails.application.routes.draw do
  namespace :api do
    resources :contents, only: [:create]

    get "/tokens/:content_id", to: "tokens#show"
    resources :tokens, only: [:index, :create, :destroy]

    resources :sessions, only: [:create] 
    delete "/sessions", to: "sessions#destroy"
    get "/sessions/start", to: "sessions#start"

    get "/xumm/:id", to: "xumm#show"
    post "/xumm", to: "xumm#create"
  end

  match "/tokens/:id", to: "api/contents#exists?", via: [:head]

  get "*path", to: "application#frontend_index_html"
end
