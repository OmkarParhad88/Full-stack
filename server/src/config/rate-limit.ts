import rateLimit from "express-rate-limit";

export const GlobalRateLimitter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
})

export const AuthRateLimitter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
})

