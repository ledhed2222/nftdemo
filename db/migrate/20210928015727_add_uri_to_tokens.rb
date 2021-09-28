class AddUriToTokens < ActiveRecord::Migration[6.1]
  def change
    add_column :tokens, :uri, :string, index: true
  end
end
