import { Router } from 'express'
import { authenticate } from '../../middleware/auth.js'
import { allowRoles } from '../../middleware/rbac.js'
import { getBill, listBills } from '../../controllers/billing.controller.js'

export const router = Router()
router.use(authenticate)
router.get('/', allowRoles('admin','accountant','attendant'), listBills)
router.get('/:id', allowRoles('admin','accountant','attendant'), getBill)
