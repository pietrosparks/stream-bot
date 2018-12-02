var cron = require('node-cron')
const { getMentions } = require('./twitter')

cron.schedule('*/2 * * * *', () => {
  console.log('Getting Mentions')
  getMentions().then(() => console.log('Done getting Mentions'))
})

module.exports = cron;