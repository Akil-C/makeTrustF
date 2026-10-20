import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail, User, ShieldCheck, Check, AlertCircle, ArrowUpRight } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('BUYER') // 'BUYER' | 'SELLER'
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [wakeNotice, setWakeNotice] = useState(false)
  const [error, setError] = useState('')

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!name || !email || !password) {
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
      await register({ name: name.trim(), email: email.trim(), password, role, captchaToken: 'simulated-turnstile-token' })
      toast.success('Registration successful! Welcome to Nexora.')
      if (role === 'SELLER') navigate('/seller/dashboard')
      else navigate('/buyer/dashboard')
    } catch (err) {
      const apiError = err.response?.data?.message || err.message || 'Registration failed. Please check your information.'
      setError(apiError)
      toast.error(apiError)
    } finally {
      clearTimeout(timer)
      setWakeNotice(false)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-plaster text-near-black flex flex-col justify-between">
      <Navbar />

      <main className="py-16 px-4 sm:px-6 lg:px-8 my-auto">
        <DemoDisclaimer className="max-w-md mx-auto mb-8" />

        <div className="max-w-md mx-auto space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-200">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="text-xs font-bold text-rose-600 uppercase tracking-wider">Join The Marketplace</div>
            <h1 className="font-bodoni text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-slate-900">
              Create a Nexora Account
            </h1>
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-rose-600 hover:underline font-semibold">
                Sign in here
              </Link>
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
                />
              </div>
            </div>

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
                  placeholder="name@domain.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-lg focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Account Role Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('BUYER')}
                  className={`py-3 px-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                    role === 'BUYER'
                      ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900/20'
                      : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <span>BUYER ACCOUNT</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('SELLER')}
                  className={`py-3 px-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                    role === 'SELLER'
                      ? 'bg-rose-600 text-white border-rose-600 ring-2 ring-rose-600/20'
                      : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <span>SELLER STORE</span>
                </button>
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
              <ShieldCheck className="w-4 h-4 text-rose-600" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 text-white hover:bg-rose-600 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 mt-2 shadow-sm"
            >
              <span>{loading ? 'CREATING ACCOUNT...' : 'CREATE VERIFIED ACCOUNT'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            {wakeNotice && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 p-2.5 rounded text-center animate-pulse">
                Connecting to cloud server... If the server was idle, it may take 30–45s to wake up on the first request.
              </p>
            )}
          </form>

        </div>
      </main>

      <Footer />
    </div>
  )
}
