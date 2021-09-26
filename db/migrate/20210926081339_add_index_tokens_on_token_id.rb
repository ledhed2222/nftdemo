class AddIndexTokensOnTokenId < ActiveRecord::Migration[6.1]
  def change
    add_index :tokens, :token_id, unique: true
  end
end
