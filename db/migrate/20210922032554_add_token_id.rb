class AddTokenId < ActiveRecord::Migration[6.1]
  def change
    add_column :tokens, :token_id, :string, null: false
  end
end
