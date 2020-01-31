/**
 * Redis conneciton file
 */
const redis = require("redis");

redisClient = client = redis.createClient({
    host: "127.0.0.1",
    port: "6379",
    // url: "", // [redis[s]:]//[[user][:password@]][host][:port][/db-number][?db=db-number[&password=bar[&option=value]]]
    socket_keepalive: true
    //    password: '',
    //    db : '',
});

// export module pool to be used in other files
module.exports = redisClient;
