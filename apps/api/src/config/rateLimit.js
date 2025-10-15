import rateLimit from 'express-rate-limit'
export const sensitiveLimiter = rateLimit({ windowMs: 60_000, max: 30 })
