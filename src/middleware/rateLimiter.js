const rateLimit = require("express-rate-limit");

const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests. Please retry after some time."
  }
});

module.exports = {
  apiRateLimiter
};
