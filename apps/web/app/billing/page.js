'use client'
import useSWR from 'swr'
const base = process.env.NEXT_PUBLIC_API_BASE_URL
const fetcher = (url) => fetch(url, { headers: { Authorization: `Bearer ${localStorage.getItem('token')||''}` } }).then(r=>r.json())
export default function BillingPage(){
  const { data } = useSWR(`${base}/api/billing`, fetcher)
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Billing</h1>
      <table className="w-full bg-white rounded shadow">
        <thead><tr><th className="p-2 text-left">Bill</th><th className="text-left">Amount</th><th className="text-left">Date</th></tr></thead>
        <tbody>
          {(data?.items||[]).map(b => (
            <tr key={b.id} className="border-t"><td className="p-2"><a className="text-blue-700 underline" href={`${base}/api/billing/${b.id}`} target="_blank">{b.id}</a></td><td>${Number(b.amount).toFixed(2)}</td><td>{new Date(b.created_at).toLocaleString()}</td></tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
