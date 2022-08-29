class Player < ApplicationRecord
    validates :nome, presence: true
end
