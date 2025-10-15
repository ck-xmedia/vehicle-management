import Link from 'next/link'
export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Parking Dashboard</h1>
      <div className="space-x-4">
        <Link className="px-3 py-2 bg-blue-600 text-white rounded" href="/dashboard">Dashboard</Link>
        <Link className="px-3 py-2 bg-green-600 text-white rounded" href="/checkin">Check-in</Link>
        <Link className="px-3 py-2 bg-yellow-600 text-white rounded" href="/checkout">Checkout</Link>
      </div>
    </main>
  )
}
