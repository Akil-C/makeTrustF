import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Lock,
  Mail,
  ShieldCheck,
  Check,
  AlertCircle,
  ArrowUpRight,
  ShoppingBag,
  Store,
  ShieldAlert,
  Sparkles,
  Loader2,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { prewarmServer, isBackendWarm } from '../../services/api'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

const DEMO_ACCOUNTS = [
  {
    role: 'BUYER',
    title: 'Buyer Portal',
    email: 'buyer1@demo.com',
    password: 'Buyer@123!',
    tag: 'Demo Buyer',
    desc: 'Browse, test escrow & order tracking',
    icon: ShoppingBag,
    color: 'from-blue-600 to-indigo-600',
    borderColor: 'hover:border-blue-500',
    bgActive: 'bg-blue-50/80 border-blue-400',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    role: 'SELLER',
    title: 'Seller Hub',
    email: 'seller1@demo.com',
    password: 'Seller@123!',
    tag: 'Verified Merchant',
    desc: 'Manage inventory, analytics & sales',
    icon: Store,
    color: 'from-emerald-600 to-teal-600',
    borderColor: 'hover:border-emerald-500',
    bgActive: 'bg-emerald-50/80 border-emerald-400',
    badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  {
    role: 'ADMIN',
    title: 'Platform Control',
    email: 'admin@markettrust.com',
    password: 'Admin@123!',
    tag: 'Super Admin',
    desc: 'KYC, disputes, audit logs & economy',
    icon: ShieldAlert,
    color: 'from-rose-600 to-pink-600',
    borderColor: 'hover:border-rose-500',
    bgActive: 'bg-rose-50/80 border-rose-400',
    badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
  },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captchaVerified, setCaptchaVerified] = useState(true)
  const [loading, setLoading] = useState(false)
  const [activeDemoRole, setActiveDemoRole] = useState(null)
  const [wakeNotice, setWakeNotice] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const noticeTimerRef = useRef(null)
  const elapsedIntervalRef = useRef(null)

  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Proactively prewarm backend server immediately upon page mount
    prewarmServer()

    return () => {
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current)
      if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current)
    }
  }, [])

  const startWakeTimer = () => {
    // Only display wake indicator if backend isn't already marked warm
    if (isBackendWarm()) return

    const startTime = Date.now()
    noticeTimerRef.current = setTimeout(() => {
      setWakeNotice(true)
      elapsedIntervalRef.current = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }, 3200) // 3.2s grace threshold before displaying wake notification
  }

  const stopWakeTimer = () => {
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current)
    if (elapsedIntervalRef.current) clearInterval(elapsedIntervalRef.current)
    setWakeNotice(false)
  }

  const executeAuth = async (loginEmail, loginPassword, roleHint) => {
    setError('')
    setSuccessMsg('')
    setLoading(true)
    setWakeNotice(false)
    setElapsedSeconds(0)

    startWakeTimer()

    try {
      const user = await login(loginEmail, loginPassword, 'simulated-turnstile-token')
      const userName = user?.name || user?.displayName || user?.email || roleHint || 'User'
      const msg = `Welcome back, ${userName}! Authenticated successfully.`
      setSuccessMsg(msg)
      toast.success(msg, { duration: 3000 })

      // Determine proper role navigation
      const primaryRole = (
        user?.role ||
        (Array.isArray(user?.roles) && user.roles[0]) ||
        roleHint ||
        ''
      )
        .replace(/^ROLE_/, '')
        .toUpperCase()

      setTimeout(() => {
        if (primaryRole === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true })
        } else if (primaryRole === 'SELLER') {
          navigate('/seller/dashboard', { replace: true })
        } else {
          navigate('/buyer/dashboard', { replace: true })
        }
      }, 350)
    } catch (err) {
      const apiError =
        err.response?.data?.message ||
        err.message ||
        'Unable to complete login. Please check your credentials or server connectivity.'
      setError(apiError)
      toast.error(apiError)
    } finally {
      stopWakeTimer()
      setLoading(false)
      setActiveDemoRole(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please fill in both email and password.')
      return
    }
    if (!captchaVerified) {
      setError('Please complete the Turnstile verification.')
      return
    }
    await executeAuth(email, password, null)
  }

  // 1-Click Instant Demo Login Handler
  const handleInstantDemoLogin = async (acc) => {
    setEmail(acc.email)
    setPassword(acc.password)
    setCaptchaVerified(true)
    setActiveDemoRole(acc.role)
    await executeAuth(acc.email, acc.password, acc.role)
  }

  // Prefill form only without submitting immediately
  const handlePrefillDemo = (e, acc) => {
    e.stopPropagation()
    setEmail(acc.email)
    setPassword(acc.password)
    setCaptchaVerified(true)
    toast('Credentials pre-filled into form', { icon: '✍️' })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans selection:bg-rose-500 selection:text-white">
      <Navbar />

      <main className="py-10 px-4 sm:px-6 lg:px-8 my-auto w-full max-w-4xl mx-auto">
        <DemoDisclaimer className="max-w-xl mx-auto mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-xl lg:max-w-none mx-auto">
          
          {/* Left Column: Instant Demo Access Cards */}
          <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                  <span>Instant 1-Click Demo Login</span>
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click any role card below to test Nexora immediately with pre-funded wallets and verified permissions:
              </p>

              <div className="space-y-3 pt-1">
                {DEMO_ACCOUNTS.map((acc) => {
                  const Icon = acc.icon
                  const isThisRoleActive = activeDemoRole === acc.role
                  return (
                    <div
                      key={acc.role}
                      onClick={() => !loading && handleInstantDemoLogin(acc)}
                      className={`group relative p-4 rounded-xl border text-left cursor-pointer transition-all duration-300 transform active:scale-[0.98] ${
                        isThisRoleActive
                          ? acc.bgActive + ' ring-2 ring-rose-500 shadow-sm'
                          : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-xs'
                      } ${loading ? 'opacity-80 pointer-events-none' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg bg-gradient-to-br ${acc.color} text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300`}
                          >
                            {isThisRoleActive ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Icon className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                                {acc.title}
                              </h3>
                              <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${acc.badgeClass}`}>
                                {acc.tag}
                              </span>
                            </div>
                            <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                              {acc.email}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handlePrefillDemo(e, acc)}
                          title="Fill form fields only"
                          className="text-[10px] text-slate-400 hover:text-slate-700 font-medium px-2 py-1 rounded hover:bg-slate-200/60 transition-colors"
                        >
                          Fill Form
                        </button>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">{acc.desc}</span>
                        <span className="font-bold text-rose-600 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform duration-200">
                          {isThisRoleActive ? 'Signing in...' : 'Sign In'}
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800">Demo Role Quick Reference:</div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                  <li><strong className="text-slate-700">Buyer:</strong> ₹226,550 available wallet + escrow hold tracking</li>
                  <li><strong className="text-slate-700">Seller:</strong> Verified Gold Merchant with inventory & revenue analytics</li>
                  <li><strong className="text-slate-700">Admin:</strong> Super Admin oversight for disputes, users & KYC review</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Standard Credentials Form */}
          <div className="lg:col-span-7 bg-white p-7 sm:p-9 rounded-2xl shadow-xs border border-slate-200/90 space-y-6 order-1 lg:order-2 transition-all duration-300">
            
            {/* Header */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">
                Authentication Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Sign In to Nexora
              </h1>
              <p className="text-xs text-slate-600">
                Or{' '}
                <Link to="/register" className="text-rose-600 hover:underline font-semibold">
                  create a new merchant or buyer account
                </Link>
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 font-medium animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 font-medium animate-in fade-in duration-200">
                <Check className="w-4 h-4 shrink-0 text-emerald-600 stroke-[3]" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => prewarmServer()}
                    placeholder="name@domain.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 shadow-2xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-rose-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => prewarmServer()}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 shadow-2xs"
                  />
                </div>
              </div>

              {/* Turnstile Verification */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCaptchaVerified(!captchaVerified)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                      captchaVerified
                        ? 'bg-rose-600 border-rose-600 text-white shadow-2xs'
                        : 'bg-white border-slate-300 hover:border-slate-400'
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
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-[11px] font-mono uppercase text-emerald-700 font-bold">Passed</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-slate-900 hover:bg-rose-600 active:scale-[0.99] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-xs hover:shadow-md cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AUTHENTICATING SECURELY...</span>
                  </>
                ) : (
                  <>
                    <span>SIGN IN TO PORTAL</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {wakeNotice && (
                <div className="p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-xl text-amber-950 text-xs space-y-2 shadow-2xs transition-all duration-300 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 font-bold text-amber-900">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600" />
                      </span>
                      Connecting to backend server...
                    </span>
                    <span className="font-mono text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded text-[11px] font-semibold">
                      {elapsedSeconds}s
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed font-normal">
                    Initial secure handshake in progress (typically responds in <span className="font-semibold text-amber-950">under 10s</span>).
                  </p>
                  <div className="w-full bg-amber-200/50 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(20, (elapsedSeconds / 10) * 100))}%` }}
                    />
                  </div>
                </div>
              )}
            </form>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
