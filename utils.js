const Twit = require('twit')
const promise = require('bluebird')

promise.promisifyAll(Twit.prototype)

const {
  TWITTER_KEY,
  TWITTER_SECRET,
  ACCESS_SECRET,
  ACCESS_TOKEN
} = require('./secrets')

const T = new Twit({
  consumer_key: TWITTER_KEY,
  consumer_secret: TWITTER_SECRET,
  access_token: ACCESS_TOKEN,
  access_token_secret: ACCESS_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true // optional - requires SSL certificates to be valid.
})


/* GET users listing. */

module.exports = {
  twitter: T
}
