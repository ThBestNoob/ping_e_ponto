class MainController < ApplicationController
    def index
        @players = Player.all.shuffle
        @matches = Match.last(4)
    end
end



