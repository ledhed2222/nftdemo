class AddBurnedFlagToTokens < ActiveRecord::Migration[6.1]
  def change
    add_column :tokens, :burned, :boolean, default: false, null: false
  end
end
