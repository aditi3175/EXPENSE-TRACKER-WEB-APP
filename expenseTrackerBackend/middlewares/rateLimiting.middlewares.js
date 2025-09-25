import rateLimit from "express-rate-limit";

// Only enable rate limiting if environment variable is set
const ENABLE_RATE_LIMITING = process.env.ENABLE_RATE_LIMITING === "true";

// Create a no-op middleware for when rate limiting is disabled
const noOpMiddleware = (req, res, next) => next();

//Key generator: preference order -> user ID > session ID > IP
const keyGenerator = (req, res) => {
  if (req.user?.id) return `user-${req.user.id}`;
  if (req.sessionID) return `session-${req.sessionID}`;
  return `ip-${req.ip}`;
};

// Very lenient general rate limit
const actualGeneralLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // Very high limit
  keyGenerator,
  message: {
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Very lenient auth rate limit
const actualAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  keyGenerator,
  message: {
    message: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => res.statusCode < 400,
});

// Very lenient expense rate limit
const actualExpenseLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200,
  keyGenerator,
  message: {
    message: "Too many expense operations, please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Export either the actual limiters or no-op middleware
export const generalLimiter = ENABLE_RATE_LIMITING
  ? actualGeneralLimiter
  : noOpMiddleware;
export const authLimiter = ENABLE_RATE_LIMITING
  ? actualAuthLimiter
  : noOpMiddleware;
export const expenseLimiter = ENABLE_RATE_LIMITING
  ? actualExpenseLimiter
  : noOpMiddleware;

console.log(
  `Rate limiting is ${ENABLE_RATE_LIMITING ? "ENABLED" : "DISABLED"}`
);
