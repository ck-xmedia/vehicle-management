import { computeBill } from '../../src/utils/fee.js'

// Mock prisma tx
const tx = { rateCard: { findFirst: async () => ({ rate_per_hour: 4, rounding_policy: 'per_hour', grace_minutes: 10 }) } }

test('computeBill per_hour with grace', async () => {
  const entry = new Date('2024-01-01T00:00:00Z')
  const exit = new Date('2024-01-01T02:05:00Z')
  const { amount, durationMinutes } = await computeBill(tx, 'car', entry, exit)
  expect(durationMinutes).toBe(115)
  expect(amount).toBe(8) // ceil(105/60)=2 hours * 4
})
