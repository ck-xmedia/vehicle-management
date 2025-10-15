import { Router } from 'express'
import { authenticate } from '../../middleware/auth.js'
import { allowRoles } from '../../middleware/rbac.js'
import { checkin, checkout } from '../../controllers/parking.controller.js'

export const router = Router()
router.post('/checkin', authenticate, allowRoles('admin','attendant'), checkin)
router.post('/checkout', authenticate, allowRoles('admin','attendant'), checkout)
