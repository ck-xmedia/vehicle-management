import { Router } from 'express'
import { authenticate } from '../../middleware/auth.js'
import { allowRoles } from '../../middleware/rbac.js'
import { dailyReport, occupancyReport, revenueReport, longDurationAlerts } from '../../controllers/reports.controller.js'

export const router = Router()
router.use(authenticate)
router.get('/daily', allowRoles('admin','accountant'), dailyReport)
router.get('/occupancy', allowRoles('admin','accountant'), occupancyReport)
router.get('/revenue', allowRoles('admin','accountant'), revenueReport)
router.get('/alerts/long-duration', allowRoles('admin','accountant'), longDurationAlerts)
