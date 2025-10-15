'use client'
import useSWR from 'swr'
const base = process.env.NEXT_PUBLIC_API_BASE_URL
const fetcher = (url) => fetch(url).then(r=>r.json())
export default function SlotsPage(){
  const { data } = useSWR(`${base}/api/slots`, fetcher)
  const { data: avail } = useSWR(`${base}/api/slots/availability`, fetcher)
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Slots</h1>
      <div className="bg-white p-4 rounded shadow">
        <div>Total: {avail?.total||0} | Occupied: {avail?.occupied||0} | Available: {avail?.available||0}</div>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {(data||[]).map(s=> (
          <div key={s.id} className={`p-3 rounded text-center ${s.status==='available'?'bg-green-100':'bg-red-100'}`}>{s.slot_no}</div>
        ))}
      </div>
    </main>
  )
}
