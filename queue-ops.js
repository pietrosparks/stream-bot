const { getLinksForKeyword, twitter } = require('./utils')
const { TWITTER_HANDLE } = require('./secrets');
const rsmq = require('./services/rsmq')
const promise = require('bluebird')
const RSMQWorker = require('rsmq-worker')
const getTweetWorker = new RSMQWorker('tweetQueue')
const sendTweetWorker = new RSMQWorker('sendTweets')

//Initialize Message Queues to listen for events
rsmq.receiveMessage('tweetQueue')
rsmq.receiveMessage('sendTweets')

/*
    1.Link Parser to check if keywords gotten from twitter 
    follows the pattern [GET, VIEW, GRAB] - ${Team}
    2. [getLinksForKeyword] Checks reddit & matches pattern, returns links back if any

*/
async function tweetLinkParser(text) {
  const actionAttributes = ['GET', 'VIEW', 'GRAB']
  const splitText = text.split(' ')

  const handleCheck = splitText[0].toLowerCase() === TWITTER_HANDLE;
  const check = actionAttributes
    .map(a => a.toLowerCase())
    .includes(splitText[1].toLowerCase())
  if (check && handleCheck) {
    console.log(text, 'Keywords retrieved')
    key = getLinksForKeyword(splitText[2])
    return key
  } else return null
}

/*
    (B)Tweet Worker to receive message to [tweetQueue] 
    1. Parse Message from string to JSON
    2. Create Links by sending to [tweetLinkParser]
    3. Fulfill all promises of replied Tweets
    4. Send Array of replies to [sendTweets] Queue
    5. Delete message from queue
*/

getTweetWorker.on('message', (message, next, id) => {
  console.log('Getting Tweets Now')
  if (message) {
    const parsedMessages = JSON.parse(message)
    const preparedLinks = parsedMessages.map(async p => {
      p.links = await tweetLinkParser(p.text)
      return p
    })
    return Promise.all(preparedLinks).then(resp => {
      const repliesToTweets = resp.filter(
        r => typeof r.links == 'object' && r.links !== null
      )
      rsmq.sendMessage('sendTweets', JSON.stringify(repliesToTweets))
      getTweetWorker.del(id)
    })
  }
})

/*
    (C)Tweet Worker to send tweet reply to user; 
    1. Parse Message from string to JSON
    2. Create Reply
    3. Fulfill all promises of twitter replies
    4. Delete message from queue by worker
*/
sendTweetWorker.on('message', (message, next, id) => {
  const replies = [
    'Hey there, the link is ready: ',
    'Here you go: ',
    'Footy time ! Here you Go',
    'Who beats who? Lets find out:',
    'Interesting games ahead:'
  ]

  const selectedReply = replies[Math.floor(Math.random() * replies.length)]

  if (message) {
    const parsed = JSON.parse(message)
    const replies = parsed.map(t => {
      const tweet = {
        status: `@${t.in_reply_to_name} ${selectedReply} - ${t.links[0]}`,
        in_reply_to_status_id: t.in_reply_to
      }

      return tweet
    })

    return promise
      .each(replies, reply => {
        return twitter.post('statuses/update', reply)
      })
      .then(() => {
        console.log('All done replying')
        sendTweetWorker.del(id)
        console.log('done deleting as well')
      })
  }
})

getTweetWorker.start()
sendTweetWorker.start()

module.exports = rsmq
