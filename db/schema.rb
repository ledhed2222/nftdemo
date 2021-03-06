# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_09_28_083336) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "contents", force: :cascade do |t|
    t.string "title", null: false
    t.text "payload", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "sessions", force: :cascade do |t|
    t.string "account", null: false
    t.string "user_token"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["account"], name: "index_sessions_on_account", unique: true
  end

  create_table "token_transactions", force: :cascade do |t|
    t.jsonb "payload", null: false
    t.bigint "token_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["token_id"], name: "index_token_transactions_on_token_id"
  end

  create_table "tokens", force: :cascade do |t|
    t.bigint "content_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "xrpl_token_id", null: false
    t.string "owner", null: false
    t.string "uri", null: false
    t.boolean "burned", default: false, null: false
    t.index ["content_id"], name: "index_tokens_on_content_id"
    t.index ["owner"], name: "index_tokens_on_owner"
    t.index ["xrpl_token_id"], name: "index_tokens_on_xrpl_token_id", unique: true
  end

  add_foreign_key "token_transactions", "tokens"
  add_foreign_key "tokens", "contents"
end
