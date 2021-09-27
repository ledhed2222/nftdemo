class CreateSessions < ActiveRecord::Migration[6.1]
  def change
    create_table :sessions do |t|
      t.string :account, null: false
      t.string :user_token

      t.timestamps
    end

    add_index :sessions, :account, unique: true
  end
end
