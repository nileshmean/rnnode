/**
 * create Account Rate Limiter Middleware file
 */
const rateLimit = require("express-rate-limit");

createAccountRateLimiterMiddleware = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // start blocking after 5 requests
    message: { success: 0, message: "Too many accounts created from this IP, please try again after an hour." }
});

// export module pool to be used in other files
module.exports = createAccountRateLimiterMiddleware;
