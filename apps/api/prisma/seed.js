import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const adminPass = await bcrypt.hash('admin123', 10)
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', password_hash: adminPass, role: 'admin' }
  })

  // Seed slots
  for (let i = 1; i <= 20; i++) {
    await prisma.parkingSlot.upsert({
      where: { slot_no: `S${i}` },
      update: {},
      create: { slot_no: `S${i}`, type: 'standard', status: 'available' }
    })
  }

  // Seed rate cards
  const now = new Date()
  const types = ['car','bike','truck','bus','other']
  for (const t of types) {
    await prisma.rateCard.create({
      data: { vehicle_type: t, rate_per_hour: 2.5, rounding_policy: 'per_hour', grace_minutes: 10, currency: 'USD', effective_from: now, active: true }
    })
  }
}


main().finally(async () => { await prisma.$disconnect() })
