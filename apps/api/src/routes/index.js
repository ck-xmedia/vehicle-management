import { Router } from 'express'
import { router as auth } from './modules/auth.routes.js'
import { router as vehicles } from './modules/vehicles.routes.js'
import { router as slots } from './modules/slots.routes.js'
import { router as parking } from './modules/parking.routes.js'
import { router as billing } from './modules/billing.routes.js'
import { router as reports } from './modules/reports.routes.js'
import { router as health } from './modules/health.routes.js'
import { router as docs } from './modules/docs.routes.js'

const router = Router()
router.use('/auth', auth)
router.use('/vehicles', vehicles)
router.use('/slots', slots)
router.use('/', parking) // /checkin, /checkout
router.use('/billing', billing)
router.use('/reports', reports)
router.use('/health', health)
router.use('/docs', docs)

export { router }
