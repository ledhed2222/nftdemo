class TokenTransaction < ApplicationRecord
  belongs_to :token

  def payload
    super.with_indifferent_access
  end
end
