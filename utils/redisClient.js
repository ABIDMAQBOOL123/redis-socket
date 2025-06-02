const { createClient } = require('redis');

const redis = createClient();
const pub = createClient();
const sub = createClient();


redis.connect();
pub.connect();
sub.connect();

module.exports = { redis, pub, sub };
