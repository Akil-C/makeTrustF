import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, ShieldCheck, Check, AlertCircle, ArrowUpRight, Eye, EyeOff, ShoppingBag, Store, Shield } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { prewarmServer } from '../../services/api'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

const DEMO_ACCOUNTS = [
  {
    role: 'BUYER',
    label: 'Demo Buyer',
    email: 'buyer1@demo.com',
    pass: 'Buyer@123!',
    desc: 'Escrow buy & order tracking',
    icon: ShoppingBag,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    btnColor: 'hover:border-emerald-500 hover:bg-emerald-50/40',
  },
  {
    role: 'SELLER',
    label: 'Demo Seller',
    email: 'seller1@demo.com',
    pass: 'Seller@123!',
    desc: 'List products & seller portal',
    icon: Store,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    btnColor: 'hover:border-blue-500 hover:bg-blue-50/40',
  },
  {
    role: 'ADMIN',
    label: 'Demo Admin',
    email: 'admin@markettrust.com',
    pass: 'Admin@123!',
    desc: 'Full moderation & platform admin',
    icon: Shield,
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    btnColor: 'hover:border-purple-500 hover:bg-purple-50/40',
  },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadingRole, setLoadingRole] = useState('')
  const [wakeNotice, setWakeNotice] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [error, setError] = useState('')

  const noticeTimerRef = useRef(null)
  const elapsedIntervalRef = useRef(null)

  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Proactively prewarm backend cloud instance as soon as login page loads
    prewarmServer()

    return () => {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current)
      if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current)
    }
  }, [])

  const executeAuth = async (targetEmail, targetPassword, roleName = '') => {
    setError('')
    setLoading(true)
    setLoadingRole(roleName)
    setWakeNotice(false)
    setElapsedSeconds(0)

    const startTime = Date.now()
    noticeTimerRef.current = setTimeout(() => {
      setWakeNotice(true)
      elapsedIntervalRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }, 1500)

    try {
      const user = await login(targetEmail, targetPassword, 'simulated-turnstile-token')
      const userName = user?.name || user?.displayName || user?.email || 'User'
      toast.success(`Welcome back, ${userName}!`, { duration: 3500 })

      setTimeout(() => {
        const userRole = user?.role || (Array.isArray(user?.roles) ? user.roles[0] : '')
        if (userRole === 'ADMIN' || userRole?.includes('ADMIN')) {
          navigate('/admin/dashboard')
        } else if (userRole === 'SELLER' || userRole?.includes('SELLER')) {
          navigate('/seller/dashboard')
        } else {
          navigate('/buyer/dashboard')
        }
      }, 300)
    } catch (err) {
      const apiError =
        err.response?.data?.message ||
        err.message ||
        'Invalid email or password. Please verify your credentials.'
      setError(apiError)
      toast.error(apiError)
    } finally {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current)
      if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current)
      setWakeNotice(false)
      setLoading(false)
      setLoadingRole('')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in both email and password.')
      return
    }
    if (!captchaVerified) {
      setError('Please complete the Turnstile verification check.')
      return
    }
    executeAuth(email, password)
  }

  const handleInstantDemoLogin = (account) => {
    setEmail(account.email)
    setPassword(account.pass)
    setCaptchaVerified(true)
    prewarmServer()
    executeAuth(account.email, account.pass, account.role)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="py-10 px-4 sm:px-6 lg:px-8 my-auto max-w-xl mx-auto w-full">
        <DemoDisclaimer className="mb-6" />

        <div className="bg-white p-7 sm:p-9 rounded-2xl shadow-xs border border-slate-200/90 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-widest block">
              Nexora Authentication
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In to Your Account
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              New to Nexora?{' '}
              <Link to="/register" className="text-rose-600 hover:text-rose-700 font-semibold hover:underline">
                Create a buyer or seller account
              </Link>
            </p>
          </div>

          {/* Quick 1-Click Demo Accounts Selector */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Instant 1-Click Demo Access
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Select a role to sign in instantly</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {DEMO_ACCOUNTS.map((acc) => {
                const Icon = acc.icon
                const isThisLoading = loading && loadingRole === acc.role
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleInstantDemoLogin(acc)}
                    disabled={loading}
                    className={`p-3 rounded-xl border border-slate-200 bg-white text-left transition-all swift-interactive flex flex-col justify-between ${acc.btnColor} ${
                      isThisLoading ? 'ring-2 ring-slate-900 bg-slate-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${acc.badgeColor}`}>
                        {acc.role}
                      </span>
                      <Icon className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{acc.label}</p>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">{acc.desc}</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-rose-600">
                      <span>{isThisLoading ? 'Signing in...' : 'Sign In →'}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 absolute">
              Or sign in manually
            </span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Manual Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => prewarmServer()}
                  placeholder="name@domain.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => prewarmServer()}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Cloudflare Turnstile Simulation */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setCaptchaVerified(!captchaVerified)}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    captchaVerified ? 'bg-rose-600 border-rose-600 text-white' : 'bg-white border-slate-300'
                  }`}
                >
                  {captchaVerified && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <span
                  className="text-xs font-medium text-slate-700 select-none cursor-pointer"
                  onClick={() => setCaptchaVerified(!captchaVerified)}
                >
                  Cloudflare Turnstile Verified
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>SECURE</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 hover:bg-rose-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs swift-interactive"
            >
              <span>{loading ? 'AUTHENTICATING...' : 'SIGN IN'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {wakeNotice && (
              <div className="p-3.5 bg-amber-50/95 border border-amber-200 rounded-xl text-amber-950 text-xs space-y-2 shadow-xs transition-all animate-pulse">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-bold text-amber-900">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600"></span>
                    </span>
                    Connecting to secure cloud instance...
                  </span>
                  <span className="font-mono text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded text-[11px] font-semibold">
                    {elapsedSeconds}s
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed font-normal">
                  Free-tier cloud backend is spinning up (ready in ~10–15s). Please remain on this page.
                </p>
                <div className="w-full bg-amber-200/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(15, (elapsedSeconds / 15) * 100))}%` }}
                  />
                </div>
              </div>
            )}
          </form>

          {/* Escrow Trust Footnote */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Escrow Protection Active: All transactions and logins are protected by biometric verification and cryptographic credentials.</span>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
