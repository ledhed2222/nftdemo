class Token < ApplicationRecord
  belongs_to :content

  def title
    content.title
  end

  def payload
    super.with_indifferent_access
  end

  def decoded_uri
    payload.dig(:transaction, :URI)&.split("")&.each_slice(2)&.map do |pair|
      pair.join.hex.chr
    end&.join
  end

  def as_json(options={})
    {
      **super(**options),
      title: title,
      decoded_uri: decoded_uri,
    }
  end
end
