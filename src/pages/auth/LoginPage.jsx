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
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-plaster text-near-black flex flex-col justify-between">
      <Navbar />

      <main className="py-16 px-4 sm:px-6 lg:px-8 my-auto">
        <DemoDisclaimer className="max-w-md mx-auto mb-8" />

        <div className="max-w-md mx-auto space-y-8 bg-paper p-8 sm:p-10 hairline-all shadow-sm">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="furniture-text text-accent">AUTHENTICATION PORTAL</div>
            <h1 className="font-bodoni text-3xl font-semibold uppercase tracking-tight text-near-black">
              SIGN IN TO NEXORA
            </h1>
            <p className="text-xs text-near-black/60 font-light">
              Or{' '}
              <Link to="/register" className="text-accent hover:underline font-medium">
                create a new merchant or buyer account
              </Link>
            </p>
          </div>

          {error && (
            <div className="p-4 bg-accent/10 border border-accent/30 text-accent text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block furniture-text text-near-black/70 mb-2">
                EMAIL ADDRESS
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-near-black/40 absolute left-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-plaster border border-near-black/20 focus:border-accent text-sm text-near-black placeholder-near-black/30 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block furniture-text text-near-black/70">
                  PASSWORD
                </label>
                <Link to="/forgot-password" className="furniture-text text-[10px] text-accent hover:underline">
                  FORGOT PASSWORD?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-near-black/40 absolute left-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-plaster border border-near-black/20 focus:border-accent text-sm text-near-black placeholder-near-black/30 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Turnstile Verification */}
            <div className="p-4 bg-plaster border border-near-black/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCaptchaVerified(!captchaVerified)}
                  className={`w-5 h-5 border flex items-center justify-center transition-colors ${
                    captchaVerified ? 'bg-accent border-accent text-white' : 'bg-white border-near-black/30'
                  }`}
                >
                  {captchaVerified && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <span
                  className="text-xs text-near-black/80 select-none cursor-pointer font-light"
                  onClick={() => setCaptchaVerified(!captchaVerified)}
                >
                  Verify Cloudflare Turnstile
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-near-black/50 furniture-text">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>SECURE</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-near-black text-plaster hover:bg-accent hover:text-white furniture-text transition-colors flex items-center justify-center gap-2"
            >
              <span>{loading ? 'AUTHENTICATING...' : 'SIGN IN'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-6 hairline-t border-near-black/10 text-center">
            <div className="furniture-text text-[10px] text-near-black/50 mb-3">QUICK DEMO ACCESSS</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { setEmail('buyer1@demo.com'); setPassword('Buyer@123!'); setCaptchaVerified(true); }}
                className="py-2 bg-plaster hover:bg-near-black hover:text-white border border-near-black/15 furniture-text text-[10px] text-near-black transition-colors"
              >
                BUYER
              </button>
              <button
                type="button"
                onClick={() => { setEmail('seller1@demo.com'); setPassword('Seller@123!'); setCaptchaVerified(true); }}
                className="py-2 bg-plaster hover:bg-near-black hover:text-white border border-near-black/15 furniture-text text-[10px] text-near-black transition-colors"
              >
                SELLER
              </button>
              <button
                type="button"
                onClick={() => { setEmail('admin@markettrust.com'); setPassword('Admin@123!'); setCaptchaVerified(true); }}
                className="py-2 bg-accent text-white hover:bg-near-black furniture-text text-[10px] transition-colors"
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
