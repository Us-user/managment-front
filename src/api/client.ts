import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

// Dev goes through the Vite proxy (same-origin, avoids CORS); prod hits the
// backend URL from VITE_API_URL directly.
const axiosRequester = axios.create({
  baseURL: import.meta.env.DEV ? '/api/v1' : import.meta.env.VITE_API_URL,
})

// Attach the bearer token from the zustand store on every request.
axiosRequester.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Unwrap `data` on success; normalize errors to a plain Error(message).
axiosRequester.interceptors.response.use(
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

export { axiosRequester }
export default axiosRequester
