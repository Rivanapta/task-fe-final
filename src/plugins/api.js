import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080', // Ganti dengan URL API Anda
  timeout: 10000,
})

// Interceptor untuk menambahkan token ke header Authorization
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      // Menambahkan token dengan format 'Bearer <token>' jika dibutuhkan oleh server
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api
