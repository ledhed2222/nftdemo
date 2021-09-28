class RenameTokenIdToXrplTokenId < ActiveRecord::Migration[6.1]
  def change
    rename_column :tokens, :token_id, :xrpl_token_id
  end
end
