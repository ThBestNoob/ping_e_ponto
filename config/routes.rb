Rails.application.routes.draw do
  
  root to: "main#index"

  get "/placar", to: "placar#index"

  get "/search", to: "placar#search"

  get "/about", to: "about#index"

  resources :players

  resources :matches
  
  get "/historico", to: "matches#index"
  get "/teste", to: "matches#teste"

  get "cadastrar", to: "registration#new"


  namespace :api do
    namespace :v1 do



    end
  end

end
