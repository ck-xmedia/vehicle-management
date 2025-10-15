import { prisma } from '../config/prisma.js'

export const listVehicles = async (req, res, next) => {
  try {
    const { query = '', type, page = 1, limit = 20 } = req.query
    const where = {
      AND: [
        query ? { vehicle_number: { contains: query, mode: 'insensitive' } } : {},
        type ? { vehicle_type: type } : {}
      ]
    }
    const [items, total] = await Promise.all([
      prisma.vehicle.findMany({ where, skip: (page-1)*limit, take: Number(limit), orderBy: { vehicle_number: 'asc' } }),
      prisma.vehicle.count({ where })
    ])
    res.json({ items, total })
  } catch (e) { next(e) }
}

export const getVehicle = async (req, res, next) => {
  try {
    const v = await prisma.vehicle.findUnique({ where: { id: req.params.id } })
    if (!v) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Vehicle not found' } })
    res.json(v)
  } catch (e) { next(e) }
}

export const upsertVehicle = async (req, res, next) => {
  try {
    const { vehicle_number, vehicle_type, owner_name, contact_no } = req.body
    const v = await prisma.vehicle.upsert({
      where: { vehicle_number },
      update: { vehicle_type, owner_name, contact_no },
      create: { vehicle_number, vehicle_type, owner_name, contact_no }
    })
    res.status(201).json(v)
  } catch (e) { next(e) }
}

export const updateVehicle = async (req, res, next) => {
  try {
    const v = await prisma.vehicle.update({ where: { id: req.params.id }, data: req.body })
    res.json(v)
  } catch (e) { next(e) }
}
