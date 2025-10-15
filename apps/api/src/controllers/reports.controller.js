import { prisma } from '../config/prisma.js'

export const dailyReport = async (req, res, next) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date()
    const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
    const end = new Date(start); end.setUTCDate(end.getUTCDate()+1)
    const [checkins, checkouts, revenue] = await Promise.all([
      prisma.parkingLog.count({ where: { checkin_time: { gte: start, lt: end } } }),
      prisma.parkingLog.count({ where: { checkout_time: { gte: start, lt: end } } }),
      prisma.billing.aggregate({ _sum: { amount: true }, where: { created_at: { gte: start, lt: end } } })
    ])
    const occupied = await prisma.parkingSlot.count({ where: { status: 'occupied' } })
    const total = await prisma.parkingSlot.count()
    res.json({ checkins, checkouts, revenue: revenue._sum.amount || 0, occupancy: total ? (occupied/total) : 0 })
  } catch (e) { next(e) }
}

export const occupancyReport = async (req, res, next) => {
  try {
    const total = await prisma.parkingSlot.count()
    const occupied = await prisma.parkingSlot.count({ where: { status: 'occupied' } })
    res.json({ total, occupied, available: total - occupied })
  } catch (e) { next(e) }
}

export const revenueReport = async (req, res, next) => {
  try {
    const { from, to } = req.query
    const sum = await prisma.billing.aggregate({ _sum: { amount: true }, where: { created_at: { gte: from ? new Date(from) : undefined, lte: to ? new Date(to) : undefined } } })
    res.json({ total_revenue: sum._sum.amount || 0 })
  } catch (e) { next(e) }
}

export const longDurationAlerts = async (req, res, next) => {
  try {
    const threshold = Number(req.query.thresholdHours || 24)
    const since = new Date(Date.now() - threshold * 3600 * 1000)
    const logs = await prisma.parkingLog.findMany({ where: { status: 'in', checkin_time: { lte: since } }, include: { vehicle: true, slot: true } })
    res.json({ items: logs })
  } catch (e) { next(e) }
}
