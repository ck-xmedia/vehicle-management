import { Router } from 'express'
import { sensitiveLimiter } from '../../config/rateLimit.js'
import { login, me } from '../../controllers/auth.controller.js'
import { authenticate } from '../../middleware/auth.js'

export const router = Router()
router.post('/login', sensitiveLimiter, login)
router.get('/me', authenticate, me)
