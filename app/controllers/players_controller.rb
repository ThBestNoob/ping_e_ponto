class PlayersController < ApplicationController

    # http_basic_authenticate_with name: Rails.application.credentials.authenticate[:name],
    #                             password: Rails.application.credentials.authenticate[:password], 
    #                             except: [:index, :show]

    http_basic_authenticate_with name: "gustavo", password: "gustavo03", except: [:index, :show]

    def index
        @players = Player.order(:id)
    end

    def show
        @player = Player.find(params[:id])
        @matches = Match.where(winner: params[:id]).or(Match.where(loser: params[:id]))
        @wins = Match.where(winner: params[:id])
        rate = @wins.length.to_f / @matches.length.to_f * 100
        @winrate = sprintf('%.2f', rate) + "%"

        if @matches.length < 10
            @winrate = "Jogue mais algumas partidas"
        end
    end

    def new
        @player = Player.new
    end

    def create
        @player = Player.new(player_params)

        if @player.save
            redirect_to @player
        else
            render :new, status: :unprocessable_unity
        end
    end

    def edit
        @player = Player.find(params[:id])
      end
    
    def update
        @player = Player.find(params[:id])

        if @player.update(player_params)
            redirect_to @player
        else
            render :edit, status: :unprocessable_entity
        end
    end

    def destroy
        @player = Player.find(params[:id])
        @player.destroy

        redirect_to players_path, status: :see_other
    end
    
    private
    def player_params
        params.require(:player).permit(:nome, :vitorias, :picture, :time)
    end
end