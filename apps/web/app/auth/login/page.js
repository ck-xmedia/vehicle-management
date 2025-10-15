'use client'
import { useState } from 'react'
import axios from 'axios'

export default function Login() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, { username, password })
      localStorage.setItem('token', res.data.accessToken)
      window.location.href = '/dashboard'
    } catch (e) {
      setError('Login failed')
    }
  }
  return (
    <main className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl font-semibold mb-4">Staff Login</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="border p-2 w-full" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" />
        <input className="border p-2 w-full" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Login</button>
      </form>
    </main>
  )
}
