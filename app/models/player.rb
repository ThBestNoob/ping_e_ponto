class Player < ApplicationRecord
    validates :nome, presence: true, length: { minimum: 2}
end
