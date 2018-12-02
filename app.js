const express = require('express')
const app = express()
const rsmq = require('./rsmq')

require('./config')(app, express)
require('./queue-ops')
require('./cron')

module.exports = app
