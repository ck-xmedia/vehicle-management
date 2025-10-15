import { logger } from '../config/logger.js'
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500
  const code = err.code || 'INTERNAL_ERROR'
  const message = err.message || 'Unexpected error'
  if (status >= 500) logger.error({ err }, 'Unhandled error')
  res.status(status).json({ error: { code, message, details: err.details } })
}
