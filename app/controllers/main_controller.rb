class MainController < ApplicationController
    def index
        @players = Player.all.shuffle
    end
end



