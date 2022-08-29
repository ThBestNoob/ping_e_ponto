class CreateJogadors < ActiveRecord::Migration[7.0]
  def change
    create_table :jogadors do |t|
      t.string :nome
      t.integer :vitorias

      t.timestamps
    end
  end
end
