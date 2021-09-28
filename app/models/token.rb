class Token < ApplicationRecord
  belongs_to :content
  has_many :token_transactions

  def title
    content.title
  end

  def decoded_uri
    uri.split("").each_slice(2).map do |pair|
      pair.join.hex.chr
    end.join
  end

  def as_json(options={})
    {
      **super(**options),
      title: title,
      decoded_uri: decoded_uri,
    }
  end
end
