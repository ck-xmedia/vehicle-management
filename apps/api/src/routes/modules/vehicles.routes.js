import { Router } from 'express'
import { authenticate } from '../../middleware/auth.js'
import { allowRoles } from '../../middleware/rbac.js'
import { listVehicles, getVehicle, upsertVehicle, updateVehicle } from '../../controllers/vehicles.controller.js'

export const router = Router()
router.use(authenticate)
router.get('/', allowRoles('admin','attendant'), listVehicles)
router.get('/:id', allowRoles('admin','attendant'), getVehicle)
router.post('/', allowRoles('admin','attendant'), upsertVehicle)
router.put('/:id', allowRoles('admin'), updateVehicle)
