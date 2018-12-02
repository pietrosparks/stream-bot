require('dotenv').load()

const { TWITTER_KEY, TWITTER_SECRET, ACCESS_SECRET, ACCESS_TOKEN } = process.env

module.exports = {
  TWITTER_KEY,
  TWITTER_SECRET,
  ACCESS_SECRET,
  ACCESS_TOKEN
}
