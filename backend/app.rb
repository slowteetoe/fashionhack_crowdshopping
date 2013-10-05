require 'sinatra'
require 'redis'
require 'json'

set :port, 4000

get '/getData' do
  { "http://fashionhack.com:4567/tumblr_mu5nuwmOMB1sk4zhuo1_500.jpg_707_500" => "http://www.betabrand.com/mens/pants/mens-japants-cargo-pants.html"}.to_json
end

post '/getData' do
  logger.info "getting data for #{params[:manifest]}"
  { "http://fashionhack.com:4567/tumblr_mu5nuwmOMB1sk4zhuo1_500.jpg_707_500" => "http://www.betabrand.com/mens/pants/mens-japants-cargo-pants.html"}.to_json
end