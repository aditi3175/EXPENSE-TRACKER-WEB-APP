import rateLimit from "express-rate-limit";

//Key generator: preference order -> user ID > session ID > IP
const keyGenerator = (req, res) => {
  if (req.user?.id) return `user-${req.user.id}`;
  if (req.sessionID) return `session-${req.sessionID}`;
  return `ip-${req.ip}`;
};

// General API rate limit - Much more lenient
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 10000 : 1000, // Increased from 500 to 1000
  keyGenerator,
  message: {
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests
  skipSuccessfulRequests: true,
  // Skip failed requests under 400
  skip: (req, res) => res.statusCode < 400,
});

// More lenient auth rate limit
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 100 : 50, // Increased from 20 to 50
  keyGenerator,
  message: {
    message: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Only count failed attempts
  skip: (req, res) => res.statusCode < 400,
});

// More lenient expense operations rate limit
export const expenseLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === "development" ? 1000 : 100, // Increased from 30 to 100
  keyGenerator,
  message: {
    message: "Too many expense operations, please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests
  skipSuccessfulRequests: true,
});

// Alternative: Create a production-specific limiter that's very lenient
export const productionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Very high limit for production
  message: {
    message: "Rate limit exceeded, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});