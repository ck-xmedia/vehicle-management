import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { router as apiRoutes } from './routes/index.js'
import { errorHandler } from './middleware/error.js'
import { requestLogger } from './middleware/requestLogger.js'
import { env } from './config/env.js'

const app = express()
app.use(helmet())
app.use(cors({ origin: env.ORIGIN || '*', credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(requestLogger)
app.use(rateLimit({ windowMs: 60 * 1000, max: 120 }))

app.use('/api', apiRoutes)

app.use(errorHandler)

export { app }
