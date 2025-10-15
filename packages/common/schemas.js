import { z } from 'zod'

export const Vehicle = z.object({
  id: z.string().uuid(),
  vehicle_number: z.string().min(3).max(20).toUpperCase(),
  vehicle_type: z.enum(['car','bike','truck','bus','other']).default('car'),
  owner_name: z.string().max(100).optional(),
  contact_no: z.string().max(15).optional()
})

export const Slot = z.object({
  id: z.string().uuid(),
  slot_no: z.string().min(1).max(10),
  type: z.enum(['standard','vip','handicapped','ev']).default('standard'),
  status: z.enum(['available','occupied']).default('available'),
  level: z.string().optional(),
  zone: z.string().optional()
})

export const CheckInRequest = z.object({
  vehicle_number: z.string().min(3).max(20),
  vehicle_type: z.enum(['car','bike','truck','bus','other']),
  slot_id: z.string().uuid().optional(),
  driver: z.object({ name: z.string().optional(), phone: z.string().optional() }).optional()
})

export const CheckInResponse = z.object({
  log_id: z.string().uuid(),
  slot: Slot,
  checkin_time: z.string(),
  qr_token: z.string().optional()
})

export const CheckoutRequest = z.object({
  vehicle_number: z.string().optional(),
  log_id: z.string().uuid().optional(),
  scan_token: z.string().optional(),
  payment_mode: z.enum(['cash','card','upi','wallet'])
})

export const CheckoutResponse = z.object({
  log_id: z.string().uuid(),
  amount: z.number(),
  duration_minutes: z.number(),
  bill_id: z.string().uuid(),
  bill_pdf_url: z.string()
})

export const RateCard = z.object({
  vehicle_type: z.enum(['car','bike','truck','bus','other']),
  rate_per_hour: z.number().nonnegative(),
  rounding_policy: z.enum(['nearest_15m','per_hour']),
  grace_minutes: z.number().int().nonnegative().default(0),
  currency: z.string().length(3).default('USD'),
  effective_from: z.string(),
  active: z.boolean().default(true)
})
