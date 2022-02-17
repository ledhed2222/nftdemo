require "net/http"

module Xumm
  XUMM_URI_ROOT = URI("https://xumm.app/api/v1/platform/payload")
  private_constant :XUMM_URI_ROOT

  def self.payload(payload_id)
    uri = URI("#{XUMM_URI_ROOT}/#{payload_id}")
    do_send(uri, Net::HTTP::Get.new(uri))
  end

  def self.submit_payload(payload, user_token: nil)
    request = Net::HTTP::Post.new(XUMM_URI_ROOT).tap do |req|
      req.body = JSON.generate({
        txjson: payload,
        user_token: user_token,
      })
    end
    do_send(XUMM_URI_ROOT, request)
  end

  def self.do_send(uri, request)
    Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
      inject_headers_into(request)
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
