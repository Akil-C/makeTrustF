import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, ShieldCheck, Check, AlertCircle, ArrowUpRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [wakeNotice, setWakeNotice] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')

    if (!email || !password) {
      setError('Please fill in all required fields.')
      return
    }

    if (!captchaVerified) {
      setError('Please verify the Turnstile CAPTCHA check.')
      return
    }

    setLoading(true)
    setWakeNotice(false)
    const timer = setTimeout(() => {
      setWakeNotice(true)
    }, 4000)

    try {
      const user = await login(email, password, 'simulated-turnstile-token')
      const userName = user?.name || user?.displayName || user?.email || 'User'
      const msg = `Login successful! Welcome back, ${userName}.`
      setSuccessMsg(msg)
      toast.success(msg, { duration: 4000 })
      
      setTimeout(() => {
        if (user.role === 'ADMIN' || user.roles?.includes('ADMIN')) navigate('/admin/dashboard')
        else if (user.role === 'SELLER' || user.roles?.includes('SELLER')) navigate('/seller/dashboard')
        else navigate('/buyer/dashboard')
      }, 500)
    } catch (err) {
      const apiError = err.response?.data?.message || err.message || 'Invalid email or password. Please check your credentials.'
      setError(apiError)
      toast.error(apiError)
    } finally {
      clearTimeout(timer)
      setWakeNotice(false)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="py-12 px-4 sm:px-6 lg:px-8 my-auto">
        <DemoDisclaimer className="max-w-md mx-auto mb-6" />

        <div className="max-w-md mx-auto space-y-6 bg-white p-8 sm:p-10 rounded-2xl shadow-xs border border-slate-200">
          
          {/* Header */}
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">Authentication Portal</span>
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
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-rose-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Turnstile Verification */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
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
                  Verify Cloudflare Turnstile
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                <span>SECURE</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 text-white hover:bg-rose-600 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>{loading ? 'AUTHENTICATING...' : 'SIGN IN'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {wakeNotice && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded text-center animate-pulse">
                Connecting to cloud server... If the server was idle, it may take 30–45s to wake up on the first request.
              </p>
            )}
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-6 border-t border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">ONE-CLICK DEMO LOGIN</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setEmail('buyer1@demo.com'); setPassword('Buyer@123!'); setCaptchaVerified(true); }}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors border border-slate-200"
              >
                BUYER
              </button>
              <button
                type="button"
                onClick={() => { setEmail('seller1@demo.com'); setPassword('Seller@123!'); setCaptchaVerified(true); }}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors border border-slate-200"
              >
                SELLER
              </button>
              <button
                type="button"
                onClick={() => { setEmail('admin@markettrust.com'); setPassword('Admin@123!'); setCaptchaVerified(true); }}
                className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                ADMIN
              </button>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
