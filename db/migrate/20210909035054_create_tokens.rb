class CreateTokens < ActiveRecord::Migration[6.1]
  def change
    create_table :tokens do |t|
      t.jsonb :payload, null: false
      t.references :content, null: false, index: true, foreign_key: true

      t.timestamps
    end
  end
end
