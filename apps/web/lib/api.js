import axios from 'axios'
export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE_URL })
api.interceptors.request.use((config)=>{
  const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})
