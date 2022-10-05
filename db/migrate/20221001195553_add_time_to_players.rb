class AddTimeToPlayers < ActiveRecord::Migration[7.0]
  def change
    add_column :players, :time, :string
  end
end
