var cron = require('node-cron')
const { getMentions } = require('./twitter')

cron.schedule('* * * * *', () => {
  console.log('Getting Mentions')
  getMentions().then(() => console.log('Done getting Mentions'))
})

module.exports = cron;