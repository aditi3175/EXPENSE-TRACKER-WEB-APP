import rateLimit from "express-rate-limit";

//Key generator: prefrence order -> user ID > session ID > IP
const keyGenerator = (req, res) => {
  if (req.user?.id) return `user-${req.user.id}`;
  if (req.sessionID) return `session-${req.sessionID}`;
  return `ip-${req.ip}`;
};

// General API rate limit
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 10000 : 500,
  keyGenerator,
  message: {
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limit for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "development" ? 100 : 20,
  keyGenerator,
  message: {
    message: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Expense operations rate limit
export const expenseLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: process.env.NODE_ENV === "development" ? 1000 : 30,
  message: {
    message: "Too many expense operations, please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
