class EditColumnName < ActiveRecord::Migration[7.0]
  def change
      rename_column :matches, :player1, :winner
      rename_column :matches, :player2, :loser
      rename_column :matches, :score1, :winner_score
      rename_column :matches, :score2, :loser_score
  end
end
