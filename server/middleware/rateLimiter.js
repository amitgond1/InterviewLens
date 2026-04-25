import rateLimit from 'express-rate-limit';

export const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Too many analysis requests. Please wait 15 minutes before trying again.' },
  standardHeaders: true,
  legacyHeaders: false
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { error: 'Too many auth requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
