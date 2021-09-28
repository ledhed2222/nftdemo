class CreateTokenTransactions < ActiveRecord::Migration[6.1]
  def change
    create_table :token_transactions do |t|
      t.jsonb :payload, null: false
      t.references :token, null: false, index: true, foreign_key: true


      t.timestamps
    end
  end
end
