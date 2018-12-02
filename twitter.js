const { twitter } = require('./utils')
const rsmq = require('./rsmq')
const makeCache = require('./cache')
const { isEmpty } = require('lodash')

module.exports.getMentions = async (lastTweetRetrieved = null) => {
  /*
        (A) Get Mentions from Twitter Sensibly
        1. If no prior tweetId in cache, retrieve all tweets, else retrieve from last tweet 
        2. Map the tweets to capture just relevant info 
        3. if the mapped array isnt empty ->
        4. Store last tweetId in cache 
        5. Send Tweets to [tweetQueue]
    */
  let options = {}
  const cache = await makeCache()
  const lastTweetId =
    lastTweetRetrieved || (await cache.getAsync('lastTweetRetrieved'))

  if (lastTweetId !== 'undefined') {
    options = {
      since_id: lastTweetId
    }
  }

  try {
    let tweets = await twitter.get('statuses/mentions_timeline', options)
    const mappedTweets = tweets.data.map(t => {
      return {
        in_reply_to_name: t.user.screen_name,
        in_reply_to: t.id_str,
        text: t.text,
        created_at: t.created_at
      }
    })
    if (!isEmpty(mappedTweets)) {
      const lastTweet = mappedTweets[0].in_reply_to
      await cache.setAsync('lastTweetRetrieved', lastTweet)
      rsmq.sendMessage('tweetQueue', JSON.stringify(mappedTweets))
    }
  } catch (err) {
    console.log(err, 'error')
  }
}

module.export = twitter
