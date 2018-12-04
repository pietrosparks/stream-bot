const redis = require('redis');
const { REDIS_HOSTNAME, REDIS_PORT } = require('../secrets')
require('bluebird').promisifyAll(redis.RedisClient.prototype)

async function init() {
    let client = redis.createClient(REDIS_PORT, REDIS_HOSTNAME, {no_ready_check: true});
    await client.authAsync(process.env.REDIS_PASSWORD);
    return client;
}

module.exports = init;