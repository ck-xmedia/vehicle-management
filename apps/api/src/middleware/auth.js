import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export const authenticate = (req, res, next) => {
  const auth = req.headers.authorization || ''
  const token = auth.startsWith('Bearer ') ? auth.substring(7) : null
  if (!token) return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing token' } })
  try {
    const payload = jwt.verify(token, env.JWT_SECRET)
    req.user = payload
    next()
  } catch (e) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid token' } })
  }
}
