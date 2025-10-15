'use client'
import { useState } from 'react'
import axios from 'axios'

export default function CheckoutPage() {
  const [vehicle_number, setVehicle] = useState('TEST-1234')
  const [payment_mode, setPay] = useState('cash')
  const [result, setResult] = useState(null)
  const submit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/checkout`, { vehicle_number, payment_mode }, { headers: { Authorization: `Bearer ${token}` } })
      setResult(res.data)
    } catch (e) { alert('Failed: '+(e?.response?.data?.error?.message||'error')) }
  }
  return (
    <main className="p-6 max-w-lg mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Checkout</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="border p-2 w-full" value={vehicle_number} onChange={e=>setVehicle(e.target.value)} placeholder="Vehicle Number" />
        <select className="border p-2 w-full" value={payment_mode} onChange={e=>setPay(e.target.value)}>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
          <option value="wallet">Wallet</option>
        </select>
        <button className="bg-yellow-600 text-white px-4 py-2 rounded" type="submit">Checkout</button>
      </form>
      {result && (
        <div className="bg-white p-4 rounded shadow">
          <div>Amount: ${result.amount.toFixed(2)}</div>
          <a className="text-blue-700 underline" href={`${process.env.NEXT_PUBLIC_API_BASE_URL}${result.bill_pdf_url}`} target="_blank">Download Receipt</a>
        </div>
      )}
    </main>
  )
}
