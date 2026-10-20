import axios from 'axios'

let rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080'
let API_URL = rawUrl.replace(/\/+$/, '')
if (API_URL.endsWith('/api')) {
  API_URL = API_URL.slice(0, -4)
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 90000,
})

// ── Request interceptor: attach Bearer token ──────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ── Response interceptor: handle 401 refresh & 403 redirect ──────────────────
let isRefreshing = false
let failedQueue  = []

function processQueue(error, token = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 401 – try silent token refresh once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/api/auth/refresh')
    ) {
      if (isRefreshing) {
        // Queue subsequent 401s while refresh is in-flight
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        isRefreshing = false
        redirectToLogin()
        return Promise.reject(error)
      }

      try {
        const res = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken })
        const { accessToken, refreshToken: newRefresh } = res.data
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefresh)
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
        processQueue(null, accessToken)
        isRefreshing = false
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        isRefreshing = false
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        redirectToLogin()
        return Promise.reject(refreshError)
      }
    }

    // 403 – forbidden, redirect to home
    if (error.response?.status === 403) {
      window.location.href = '/'
    }

    if (error.code === 'ECONNABORTED' || (error.message && error.message.toLowerCase().includes('timeout'))) {
      error.message = 'The server is taking longer than expected to respond (it may be waking up from free-tier sleep). Please try again in a moment.'
    }

    return Promise.reject(error)
  },
)

function redirectToLogin() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  if (!window.location.pathname.includes('/login')) {
    window.location.href = '/login'
  }
}

export default api
