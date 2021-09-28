class RemovePayloadFromTokens < ActiveRecord::Migration[6.1]
  def change
    remove_column :tokens, :payload, :jsonb, null: false
  end
end
