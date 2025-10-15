import { differenceInMinutes } from 'date-fns'
import { prisma } from '../config/prisma.js'

export const computeBill = async (txOrPrisma, vehicle_type, entry, exit) => {
  const tx = txOrPrisma || prisma
  const rate = await tx.rateCard.findFirst({ where: { vehicle_type, active: true }, orderBy: { effective_from: 'desc' } })
  if (!rate) return { amount: 0, durationMinutes: 0 }
  let minutes = Math.max(0, differenceInMinutes(exit, entry) - (rate.grace_minutes || 0))
  let units
  if (rate.rounding_policy === 'nearest_15m') {
    units = Math.round(minutes / 15)
    const ratePer15 = Number(rate.rate_per_hour) / 4
    return { amount: units * ratePer15, durationMinutes: minutes }
  } else { // per_hour
    units = Math.ceil(minutes / 60)
    return { amount: units * Number(rate.rate_per_hour), durationMinutes: minutes }
  }
}
