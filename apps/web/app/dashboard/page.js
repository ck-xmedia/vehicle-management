'use client'
import useSWR from 'swr'
const fetcher = (url) => fetch(url).then(r=>r.json())
export default function Dashboard() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL
  const { data } = useSWR(`${base}/api/reports/daily`, fetcher)
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Card title="Check-ins Today" value={data?.checkins||0} />
        <Card title="Revenue" value={`$${(data?.revenue||0).toFixed(2)}`} />
        <Card title="Occupied" value={data?.occupancy ? `${Math.round(data.occupancy*100)}%` : '0%'} />
      </div>
    </main>
  )
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <div className="text-gray-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}
