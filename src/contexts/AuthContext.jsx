import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import authService from '../services/authService'
import walletService from '../services/walletService'

const AuthContext = createContext(null)

/** Decode JWT payload without verifying signature */
function decodeJWT(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

/** Returns ms until JWT expiry, or 0 if already expired */
function msUntilExpiry(token) {
  const decoded = decodeJWT(token)
  if (!decoded?.exp) return 0
  return decoded.exp * 1000 - Date.now()
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('user')
      if (cached) {
        const parsed = JSON.parse(cached)
        if (!parsed.role && Array.isArray(parsed.roles) && parsed.roles.length > 0) {
          parsed.role = parsed.roles[0].replace(/^ROLE_/, '')
        }
        return parsed
      }
    } catch {
      // ignore
    }
    return null
  })

  const [isLoading, setIsLoading] = useState(() => {
    const token = localStorage.getItem('accessToken')
    const cached = localStorage.getItem('user')
    return !!token && !cached
  })

  const [walletBalance, setWalletBalance]   = useState(0)
  const refreshTimerRef                     = useRef(null)
  const navigate                            = useNavigate()

  // ── Helper to normalize user data ─────────────────────────────────────────
  const normalizeUser = (rawUser) => {
    if (!rawUser) return null
    const u = { ...rawUser }
    if (!u.role) {
      if (Array.isArray(u.roles) && u.roles.length > 0) {
        const foundAdmin = u.roles.find(r => r.includes('ADMIN'))
        const foundSeller = u.roles.find(r => r.includes('SELLER'))
        u.role = (foundAdmin || foundSeller || u.roles[0]).replace(/^ROLE_/, '')
      } else {
        u.role = 'BUYER'
      }
    } else {
      u.role = u.role.replace(/^ROLE_/, '')
    }
    return u
  }

  // ── Token helpers ────────────────────────────────────────────────────────
  const clearRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }
  }

  const scheduleTokenRefresh = useCallback((token) => {
    clearRefreshTimer()
    const ms = msUntilExpiry(token) - 5 * 60 * 1000 // 5 min before expiry
    if (ms <= 0) return
    refreshTimerRef.current = setTimeout(async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) return
        const res = await authService.refreshToken(refreshToken)
        const { accessToken, refreshToken: newRefresh } = res.data
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', newRefresh)
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
        scheduleTokenRefresh(accessToken)
      } catch {
        handleLogout()
      }
    }, ms)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Wallet ───────────────────────────────────────────────────────────────
  const refreshWallet = useCallback(async () => {
    try {
      const res = await walletService.getBalance()
      const bal = res.data?.balance ?? res.data?.availableCredits ?? 0
      setWalletBalance(bal)
      setUser(prev => prev ? { ...prev, walletBalance: bal } : prev)
    } catch {
      // silent – wallet is non-critical
    }
  }, [])

  // ── Bootstrap: restore session on mount ─────────────────────────────────
  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setIsLoading(false)
        setWalletBalance(0)
        return
      }
      // Check if token is still alive
      if (msUntilExpiry(token) <= 0) {
        try {
          const refreshToken = localStorage.getItem('refreshToken')
          if (!refreshToken) throw new Error('No refresh token')
          const res = await authService.refreshToken(refreshToken)
          const { accessToken, refreshToken: newRefresh } = res.data
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', newRefresh)
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
          scheduleTokenRefresh(accessToken)
        } catch {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          setUser(null)
          setWalletBalance(0)
          setIsLoading(false)
          return
        }
      } else {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        scheduleTokenRefresh(token)
      }
      // Fetch current user profile
      try {
        const res = await authService.getCurrentUser()
        const normalized = normalizeUser(res.data)
        setUser(normalized)
        localStorage.setItem('user', JSON.stringify(normalized))
        await refreshWallet()
      } catch {
        // If profile fetch fails but token exists, check if cached user is valid
        const cached = localStorage.getItem('user')
        if (!cached) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          delete api.defaults.headers.common['Authorization']
          setUser(null)
          setWalletBalance(0)
        }
      } finally {
        setIsLoading(false)
      }
    }
    bootstrap()
    return () => clearRefreshTimer()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auth actions ─────────────────────────────────────────────────────────
  const login = useCallback(async (email, password, captchaToken) => {
    const res = await authService.login({ email, password, captchaToken })
    const { accessToken, refreshToken } = res.data
    const rawUser = res.data.user || res.data.userInfo || {}
    const userData = normalizeUser(rawUser)

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(userData))
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    scheduleTokenRefresh(accessToken)
    setUser(userData)
    await refreshWallet()
    return userData
  }, [scheduleTokenRefresh, refreshWallet])

  const register = useCallback(async (data) => {
    const res = await authService.register(data)
    const { accessToken, refreshToken } = res.data
    const rawUser = res.data.user || res.data.userInfo || {}
    const userData = normalizeUser(rawUser)

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(userData))
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    scheduleTokenRefresh(accessToken)
    setUser(userData)
    return userData
  }, [scheduleTokenRefresh])

  const handleLogout = useCallback(async () => {
    clearRefreshTimer()
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) await authService.logout(refreshToken)
    } catch { /* best-effort */ }
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    setWalletBalance(0)
    navigate('/login')
  }, [navigate])

  const updateUser = useCallback((data) => {
    setUser((prev) => {
      const updated = normalizeUser({ ...prev, ...data })
      localStorage.setItem('user', JSON.stringify(updated))
      return updated
    })
  }, [])

  const hasRole = useCallback((requiredRole) => {
    if (!user) return false
    const checkOne = (r) => {
      const clean = (r || '').replace(/^ROLE_/, '').toUpperCase()
      const userRole = (user.role || '').replace(/^ROLE_/, '').toUpperCase()
      if (userRole === clean) return true
      if (Array.isArray(user.roles)) {
        return user.roles.some(ur => (ur || '').replace(/^ROLE_/, '').toUpperCase() === clean)
      }
      return false
    }
    if (Array.isArray(requiredRole)) return requiredRole.some(checkOne)
    return checkOne(requiredRole)
  }, [user])

  const addDemoCredits = useCallback((amount = 50000) => {
    setWalletBalance((prev) => {
      const next = Number(prev || 0) + Number(amount)
      setUser((u) => {
        if (!u) return u
        const updated = { ...u, walletBalance: next }
        localStorage.setItem('user', JSON.stringify(updated))
        return updated
      })
      return next
    })
  }, [])

  const value = {
    user,
    role: user?.role,
    isAuthenticated: !!user,
    isLoading,
    walletBalance,
    login,
    register,
    logout: handleLogout,
    updateUser,
    hasRole,
    refreshWallet,
    addDemoCredits,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
