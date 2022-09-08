class CreateMatches < ActiveRecord::Migration[7.0]
  def change
    create_table :matches do |t|
      t.integer :player1
      t.integer :player2
      t.integer :score1
      t.integer :score2

      t.timestamps
    end
  end
end
