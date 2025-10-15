import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import { getOpenApiDoc } from '../../schemas/openapi.js'

export const router = Router()
router.get('/openapi.json', async (req, res) => {
  const doc = await getOpenApiDoc()
  res.json(doc)
})
router.use('/', async (req, res, next) => {
  const doc = await getOpenApiDoc()
  swaggerUi.serve(req, res, next)
  swaggerUi.setup(doc)(req, res, next)
})
