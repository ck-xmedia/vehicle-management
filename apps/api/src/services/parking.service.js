import { prisma } from '../config/prisma.js'
import { ioEmit } from '../realtime/socket.js'
import { computeBill } from '../utils/fee.js'
import { generateBillPdf } from '../utils/pdf.js'
import { v4 as uuidv4 } from 'uuid'

export const checkinService = async (payload, user) => {
  const { vehicle_number, vehicle_type, slot_id, driver } = payload
  return await prisma.$transaction(async (tx) => {
    const v = await tx.vehicle.upsert({
      where: { vehicle_number },
      update: { vehicle_type },
      create: { vehicle_number, vehicle_type }
    })

    const active = await tx.parkingLog.findFirst({ where: { vehicle_id: v.id, checkout_time: null } })
    if (active) {
      const err = new Error('Vehicle already checked in')
      err.status = 409; err.code = 'VEHICLE_ACTIVE_SESSION'
      throw err
    }

    let slot
    if (slot_id) {
      slot = await tx.parkingSlot.findUnique({ where: { id: slot_id } })
      if (!slot || slot.status !== 'available') {
        const err = new Error('Slot unavailable')
        err.status = 422; err.code = 'SLOT_UNAVAILABLE'
        throw err
      }
    } else {
      slot = await tx.parkingSlot.findFirst({ where: { status: 'available', OR: [{ type: 'standard' }, { type: vehicle_type === 'bike' ? 'standard':'standard' }] }, orderBy: { slot_no: 'asc' } })
      if (!slot) {
        const err = new Error('No available slot')
        err.status = 422; err.code = 'NO_SLOT'
        throw err
      }
    }

    const log = await tx.parkingLog.create({ data: { vehicle_id: v.id, slot_id: slot.id, status: 'in', driver_name: driver?.name || null, driver_phone: driver?.phone || null } })
    await tx.parkingSlot.update({ where: { id: slot.id }, data: { status: 'occupied' } })

    ioEmit('parking', 'checkin', { id: log.id })
    ioEmit('slots', 'occupancy:update')

    return { log_id: log.id, slot, checkin_time: log.checkin_time.toISOString() }
  })
}

export const checkoutService = async (payload, user) => {
  const { vehicle_number, log_id, payment_mode } = payload
  return await prisma.$transaction(async (tx) => {
    const log = await (async () => {
      if (log_id) return tx.parkingLog.findUnique({ where: { id: log_id }, include: { vehicle: true, slot: true } })
      if (vehicle_number) return tx.parkingLog.findFirst({ where: { status: 'in', checkout_time: null, vehicle: { vehicle_number } }, include: { vehicle: true, slot: true } })
      return null
    })()

    if (!log) { const e = new Error('Active session not found'); e.status=404; e.code='NOT_FOUND'; throw e }

    const now = new Date()
    const { amount, durationMinutes } = await computeBill(tx, log.vehicle.vehicle_type, log.checkin_time, now)

    const updated = await tx.parkingLog.update({ where: { id: log.id }, data: { checkout_time: now, total_minutes: durationMinutes, bill_amount: amount, status: 'out' } })
    await tx.parkingSlot.update({ where: { id: log.slot_id }, data: { status: 'available' } })

    const billId = uuidv4()
    const pdfPath = await generateBillPdf({ billId, log: { ...log, checkout_time: now }, amount, payment_mode })
    const bill = await tx.billing.create({ data: { id: billId, log_id: log.id, payment_mode, bill_pdf_path: pdfPath, amount } })

    ioEmit('parking', 'checkout', { id: log.id })
    ioEmit('slots', 'occupancy:update')

    return { log_id: log.id, amount, duration_minutes: durationMinutes, bill_id: bill.id, bill_pdf_url: `/api/billing/${bill.id}` }
  })
}
