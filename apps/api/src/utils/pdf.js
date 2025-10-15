import fs from 'fs'
import path from 'path'
import PDFDocument from 'pdfkit'

export const generateBillPdf = async ({ billId, log, amount, payment_mode }) => {
  const dir = path.resolve('apps/api/storage/bills')
  fs.mkdirSync(dir, { recursive: true })
  const file = path.join(dir, `${billId}.pdf`)
  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  const stream = fs.createWriteStream(file)
  doc.pipe(stream)
  doc.fontSize(20).text('Parking Receipt', { align: 'center' })
  doc.moveDown()
  doc.fontSize(12)
  doc.text(`Bill ID: ${billId}`)
  doc.text(`Vehicle: ${log.vehicle?.vehicle_number || ''}`)
  doc.text(`Slot: ${log.slot?.slot_no || ''}`)
  doc.text(`Check-in: ${new Date(log.checkin_time).toISOString()}`)
  doc.text(`Check-out: ${new Date(log.checkout_time).toISOString()}`)
  doc.text(`Payment Mode: ${payment_mode}`)
  doc.moveDown()
  doc.fontSize(16).text(`Amount: ${amount.toFixed(2)}`)
  doc.end()
  await new Promise((resolve) => stream.on('finish', resolve))
  return file
}
