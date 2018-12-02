const express = require('express')
const app = express()

require('./config')(app, express)
require('./queue-ops')
require('./services/cron')

module.exports = app
