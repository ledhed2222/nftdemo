class MakeUriFieldNotNull < ActiveRecord::Migration[6.1]
  def change
    change_column_null :tokens, :uri, false
  end
end
