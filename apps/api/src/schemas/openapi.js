import { OpenAPIRegistry, generateOpenApiDocument } from 'zod-to-openapi'
import { z } from 'zod'
import * as Schemas from '@parking/common/schemas.js'

let cached
export const getOpenApiDoc = async () => {
  if (cached) return cached
  const registry = new OpenAPIRegistry()

  registry.registerPath({
    method: 'post',
    path: '/api/checkin',
    request: { body: { content: { 'application/json': { schema: Schemas.CheckInRequest } } } },
    responses: { 201: { description: 'checkin ok', content: { 'application/json': { schema: Schemas.CheckInResponse } } } }
  })

  registry.registerPath({
    method: 'post',
    path: '/api/checkout',
    request: { body: { content: { 'application/json': { schema: Schemas.CheckoutRequest } } } },
    responses: { 200: { description: 'checkout ok', content: { 'application/json': { schema: Schemas.CheckoutResponse } } } }
  })

  cached = generateOpenApiDocument(registry.definitions, {
    openapi: '3.0.0',
    info: { title: 'Parking API', version: '1.0.0' }
  })
  return cached
}
