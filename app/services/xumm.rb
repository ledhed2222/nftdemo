require "net/http"

module Xumm
  XUMM_URI_ROOT = "https://xumm.app/api/v1/platform"
  private_constant :XUMM_URI_ROOT

  def self.payload(payload_id)
    uri = URI("#{XUMM_URI_ROOT}/payload/#{payload_id}")

    request = Net::HTTP::Get.new(uri).tap do |req|
      inject_headers_into(req)
    end

    do_send(uri, request)
  end

  def self.submit_payload(payload, user_token: nil)
    uri = URI("#{XUMM_URI_ROOT}/payload")

    request = Net::HTTP::Post.new(uri).tap do |req|
      inject_headers_into(req)
      req.body = JSON.generate({
        txjson: payload,
        user_token: user_token,
      })
    end

    do_send(uri, request)
  end

  def self.do_send(uri, request)
    Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      http.request(request)
    end.yield_self do |response|
      JSON.parse(response.body)
    end.with_indifferent_access
  end
  private_class_method :do_send

  def self.inject_headers_into(request)
    request["Content-Type"] = "application/json"
    request["X-API-Key"] = ENV["XUMM_API_KEY"]
    request["X-API-Secret"] = ENV["XUMM_API_SECRET"]
  end
  private_class_method :inject_headers_into
end
