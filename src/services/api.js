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

// ── Cloud Pre-warming & Keep-Alive State ──────────────────────────────────────
let isServerWarm = false
let lastWarmedAt = 0
let prewarmPromise = null

export function markBackendWarm() {
  isServerWarm = true
  lastWarmedAt = Date.now()
}

export function isBackendWarm() {
  // Free-tier cloud instances sleep after ~15 mins of idle. Consider warm if < 8 mins.
  return isServerWarm && (Date.now() - lastWarmedAt < 8 * 60 * 1000)
}

/**
 * Proactively pings the backend /health probe to wake up the cloud container
 * before the user submits actions (reducing perceived wait from 30s to <10-15s or 0s).
 */
export async function prewarmServer() {
  const now = Date.now()
  if (isServerWarm && now - lastWarmedAt < 8 * 60 * 1000) {
    return true
  }

  if (prewarmPromise) {
    return prewarmPromise
  }

  prewarmPromise = (async () => {
    try {
      // Race health probes simultaneously with fast responsive timeout
      const ping1 = axios.get(`${API_URL}/api/health`, {
        timeout: 12000,
        headers: { 'Cache-Control': 'no-cache' },
      })
      const ping2 = axios.get(`${API_URL}/health`, {
        timeout: 12000,
        headers: { 'Cache-Control': 'no-cache' },
      })

      const res = await Promise.race([ping1, ping2]).catch(() => Promise.any([ping1, ping2]))

      if (res && (res.status === 200 || res.status === 204)) {
        markBackendWarm()
        return true
      }
    } catch {
      // Silently catch - prewarming is non-blocking background acceleration
    } finally {
      prewarmPromise = null
    }
    return false
  })()

  return prewarmPromise
}

// ── Background Keep-Alive Heartbeat ──────────────────────────────────────────
// Periodically pings /api/health every 9 minutes while the browser tab is open
// so active users never experience idle cold-starts.
if (typeof window !== 'undefined') {
  const HEARTBEAT_INTERVAL = 9 * 60 * 1000 // 9 minutes

  setInterval(() => {
    if (document.visibilityState !== 'hidden') {
      prewarmServer()
    }
  }, HEARTBEAT_INTERVAL)

  // Wake up immediately when user focuses back on the tab after being away
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      const now = Date.now()
      if (now - lastWarmedAt > 8 * 60 * 1000) {
        prewarmServer()
      }
    }
  })
}

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
  (response) => {
    markBackendWarm()
    return response
  },
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
