import rateLimit from "express-rate-limit";

export const contactLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3,              // 3 requests per minute per IP
  message: { error: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
