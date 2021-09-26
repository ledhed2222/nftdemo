class AddTokensOwner < ActiveRecord::Migration[6.1]
  def change
    add_column :tokens, :owner, :string, null: false
    add_index :tokens, :owner
  end
end
