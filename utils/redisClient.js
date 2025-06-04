// const { createClient } = require('redis');
// const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';

// const redis = createClient();
// const pub = createClient();
// const sub = createClient();

// redis.connect();
// pub.connect();
// sub.connect();

// module.exports = { redis, pub, sub };

const { createClient } = require("redis");
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const redis = createClient({ url: redisUrl });
const pub = createClient({ url: redisUrl });
const sub = createClient({ url: redisUrl });


(async () => {
  try {
    await redis.connect();
    await pub.connect();
    await sub.connect();
    console.log("Redis clients connected");
  } catch (err) {
    console.error("Redis connection error:", err);
  }
})();

module.exports = { redis, pub, sub };
