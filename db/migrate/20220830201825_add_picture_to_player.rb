class AddPictureToPlayer < ActiveRecord::Migration[7.0]
  def change
    add_column :players, :picture, :boolean
  end
end
