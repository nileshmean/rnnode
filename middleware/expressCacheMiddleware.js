/**
 * cache API in redis or memory cache for routes
 */
const apicache = require("apicache");

// configure redis connection open below line and add
// redisClient to the redisClient in below configuration
// var redisClient = require("./../config/redisConnection");

// normal file cache open and add cache to the redisClient
const cache = require("memory-cache");

expressCache = apicache.options({
    debug: false, // if true, enables console output
    defaultDuration: "24 hour", // should be either a number (in ms) or a string, defaults to 1 hour
    enabled: true, // if false, turns off caching globally (useful on dev)
    redisClient: cache, // if provided, uses the [node-redis](https://github.com/NodeRedis/node_redis) client instead of [memory-cache](https://github.com/ptarjan/node-cache)
    // appendKey:        fn(req, res),     // appendKey takes the req/res objects and returns a custom value to extend the cache key
    // headerBlacklist:  [],               // list of headers that should never be cached
    statusCodes: {
        //   exclude:        [422, 404, 500, 429],               // list status codes to specifically exclude (e.g. [404, 403] cache all responses unless they had a 404 or 403 status)
        include: [200] // list status codes to require (e.g. [200] caches ONLY responses with a success/200 code)
    },
    headers: {
        "cache-control": "no-cache"
    }
}).middleware;

// export module pool to be used in other files
module.exports = expressCache();
