'use client'
import { useState } from 'react'
import axios from 'axios'

export default function CheckinPage() {
  const [vehicle_number, setVehicle] = useState('TEST-1234')
  const [vehicle_type, setType] = useState('car')
  const [message, setMessage] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/checkin`, { vehicle_number, vehicle_type }, { headers: { Authorization: `Bearer ${token}` } })
      setMessage(`Checked in. Slot ${res.data.slot.slot_no}`)
    } catch (e) { setMessage('Failed: '+(e?.response?.data?.error?.message||'error')) }
  }
  return (
    <main className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold mb-4">Check-in</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="border p-2 w-full" value={vehicle_number} onChange={e=>setVehicle(e.target.value)} placeholder="Vehicle Number" />
        <select className="border p-2 w-full" value={vehicle_type} onChange={e=>setType(e.target.value)}>
          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="truck">Truck</option>
          <option value="bus">Bus</option>
          <option value="other">Other</option>
        </select>
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Check-in</button>
      </form>
      {message && <div className="mt-3">{message}</div>}
    </main>
  )
}
