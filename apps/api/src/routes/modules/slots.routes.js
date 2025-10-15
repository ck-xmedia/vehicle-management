import { Router } from 'express'
import { authenticate } from '../../middleware/auth.js'
import { allowRoles } from '../../middleware/rbac.js'
import { listSlots, createSlot, patchSlot, availability } from '../../controllers/slots.controller.js'

export const router = Router()
router.use(authenticate)
router.get('/', listSlots)
router.get('/availability', availability)
router.post('/', allowRoles('admin'), createSlot)
router.patch('/:id', allowRoles('admin'), patchSlot)
