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
  const [user, setUser]                     = useState(null)
  const [isLoading, setIsLoading]           = useState(true)
  const [walletBalance, setWalletBalance]   = useState(0)
  const refreshTimerRef                     = useRef(null)
  const navigate                            = useNavigate()

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
      setWalletBalance(res.data.balance ?? 0)
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
        return
      }
      // Check if token is still alive
      if (msUntilExpiry(token) <= 0) {
        try {
          const refreshToken = localStorage.getItem('refreshToken')
          const res = await authService.refreshToken(refreshToken)
          const { accessToken, refreshToken: newRefresh } = res.data
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', newRefresh)
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
          scheduleTokenRefresh(accessToken)
        } catch {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
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
        setUser(res.data)
        await refreshWallet()
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        delete api.defaults.headers.common['Authorization']
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
    const { accessToken, refreshToken, user: userData } = res.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    scheduleTokenRefresh(accessToken)
    setUser(userData)
    await refreshWallet()
    return userData
  }, [scheduleTokenRefresh, refreshWallet])

  const register = useCallback(async (data) => {
    const res = await authService.register(data)
    const { accessToken, refreshToken, user: userData } = res.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
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
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    setWalletBalance(0)
    navigate('/login')
  }, [navigate])

  const updateUser = useCallback((data) => {
    setUser((prev) => ({ ...prev, ...data }))
  }, [])

  const hasRole = useCallback((role) => {
    if (!user) return false
    if (Array.isArray(role)) return role.includes(user.role)
    return user.role === role
  }, [user])

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    walletBalance,
    login,
    register,
    logout: handleLogout,
    updateUser,
    hasRole,
    refreshWallet,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
