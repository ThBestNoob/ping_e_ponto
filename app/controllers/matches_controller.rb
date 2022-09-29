class MatchesController < ApplicationController

    skip_before_action :verify_authenticity_token

    def index
        @matches = Match.all
    end

    def create
        @match = Match.new(match_params)

        @match.save
    end

    def teste
        @matches = Match.where(winner: 1).or(Match.where(loser: 1))
        @wins = Match.where(winner: 1)
        @winrate = (@wins.length.to_f / @matches.length.to_f * 100).to_s + "%"

        if @matches.length < 10
            @winrate = "Jogue mais algumas partidas"
        end
    end

    private
    def match_params
        params.require(:match).permit(:winner, :loser, :winner_score, :loser_score)
    end
        
end
