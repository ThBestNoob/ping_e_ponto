class PlayersController < ApplicationController
    def index
        @players = Player.all
    end

    def show
        @player = Player.find(params[:id])
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
        params.require(:player).permit(:nome, :vitorias)
    end
end