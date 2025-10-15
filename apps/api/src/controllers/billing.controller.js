import path from 'path'
import { prisma } from '../config/prisma.js'

export const listBills = async (req, res, next) => {
  try {
    const { from, to, vehicle_number, mode } = req.query
    const where = {
      AND: [
        from ? { created_at: { gte: new Date(from) } } : {},
        to ? { created_at: { lte: new Date(to) } } : {},
        mode ? { payment_mode: mode } : {},
        vehicle_number ? { parking_log: { vehicle: { vehicle_number } } } : {}
      ]
    }
    const items = await prisma.billing.findMany({ where, include: { parking_log: { include: { vehicle: true } } }, orderBy: { created_at: 'desc' } })
    res.json({ items })
  } catch (e) { next(e) }
}

export const getBill = async (req, res, next) => {
  try {
    const bill = await prisma.billing.findUnique({ where: { id: req.params.id } })
    if (!bill) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Bill not found' } })
    res.setHeader('Content-Type', 'application/pdf')
    res.sendFile(path.resolve(bill.bill_pdf_path))
  } catch (e) { next(e) }
}
