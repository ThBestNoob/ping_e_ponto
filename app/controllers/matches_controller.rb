class MatchesController < ApplicationController

    skip_before_action :verify_authenticity_token

    def index
        @matches = Match.all
    end

    def create
        @match = Match.new(match_params)

        @match.save
    end

    private
    def match_params
        params.require(:match).permit(:player1, :player2, :score1, :score2)
    end
        
end
