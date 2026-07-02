import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const client = axios.create({
  baseURL: 'https://task-management-backend-qb4d.onrender.com/api/v1',
})

// Attach the bearer token from the zustand store on every request.
client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Unwrap `data` on success; normalize errors to a plain Error(message).
client.interceptors.response.use(
  (res) => res.data,
  (err) =>
    Promise.reject(
      new Error(
        err.response?.data?.message ??
          err.response?.data?.detail ??
          err.message ??
          'Request failed',
      ),
    ),
)

export default client
