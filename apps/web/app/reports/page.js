'use client'
import useSWR from 'swr'
const base = process.env.NEXT_PUBLIC_API_BASE_URL
const fetcher = (url) => fetch(url, { headers: { Authorization: `Bearer ${localStorage.getItem('token')||''}` } }).then(r=>r.json())
export default function ReportsPage(){
  const { data: daily } = useSWR(`${base}/api/reports/daily`, fetcher)
  const { data: rev } = useSWR(`${base}/api/reports/revenue`, fetcher)
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Reports</h1>
      <div className="grid grid-cols-2 gap-4">
        <Card title="Check-ins Today" value={daily?.checkins||0} />
        <Card title="Revenue Total" value={`$${(rev?.total_revenue||0).toFixed(2)}`} />
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
