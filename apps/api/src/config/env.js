import dotenv from 'dotenv'
dotenv.config({ path: new URL('../../.env', import.meta.url).pathname })

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 4000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change',
  ORIGIN: process.env.ORIGIN || 'http://localhost:3000',
  PDF_STORAGE: process.env.PDF_STORAGE || 'local',
  RATE_CACHE_TTL: parseInt(process.env.RATE_CACHE_TTL || '300', 10)
}
