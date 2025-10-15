import { prisma } from '../config/prisma.js'

export const listSlots = async (req, res, next) => {
  try {
    const items = await prisma.parkingSlot.findMany({ orderBy: { slot_no: 'asc' } })
    res.json(items)
  } catch (e) { next(e) }
}

export const availability = async (req, res, next) => {
  try {
    const total = await prisma.parkingSlot.count()
    const occupied = await prisma.parkingSlot.count({ where: { status: 'occupied' } })
    const byCategory = Object.fromEntries(
      (await Promise.all(['standard','vip','handicapped','ev'].map(async t => {
        const a = await prisma.parkingSlot.count({ where: { type: t, status: 'available' } })
        return [t, a]
      })))
    )
    res.json({ total, occupied, available: total - occupied, byCategory })
  } catch (e) { next(e) }
}

export const createSlot = async (req, res, next) => {
  try {
    const s = await prisma.parkingSlot.create({ data: req.body })
    res.status(201).json(s)
  } catch (e) { next(e) }
}

export const patchSlot = async (req, res, next) => {
  try {
    const s = await prisma.parkingSlot.update({ where: { id: req.params.id }, data: req.body })
    res.json(s)
  } catch (e) { next(e) }
}
