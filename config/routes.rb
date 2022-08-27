Rails.application.routes.draw do
  
  root to: "main#index"

  get "/placar", to: "placar#index"

  get "/about", to: "about#index"

  get "/cadastros", to: "cadastros#index"
  
  get "/historico", to: "historico#index"

end
