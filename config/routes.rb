Rails.application.routes.draw do
  
  root to: "main#index"

  get "/placar", to: "placar#index"

  get "/search", to: "placar#search"

  get "/about", to: "about#index"

  resources :players
  
  get "/historico", to: "historico#index"

  get "cadastrar", to: "registration#new"

end
