class PlacarController < ApplicationController
    def index

    end

    def search
        if params[:search].blank?
            redirect_to placar_path and return
        else
            @parameter = params[:search].downcase
            @results = Player.all.where("lower(nome) LIKE :search", search: "%#{@parameter}%")
            
            respond_to do |format|
                format.json { render json: @results.to_json}
                format.html
            end
        end
    end    
end




