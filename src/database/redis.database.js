const redis = require('redis');
const dotenv = require('dotenv')

dotenv.config()

const REDIS_URL = process.env.REDIS_URL

const client = redis.createClient({
    socket: {
        port: 6379,
        host: REDIS_URL
    }
});

module.exports = client