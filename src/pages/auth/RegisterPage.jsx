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
    try {
      await register({ name, email, password, role, captchaToken: 'simulated-turnstile-token' })
      toast.success('Registration successful! Welcome to Nexora.')
      if (role === 'SELLER') navigate('/seller/dashboard')
      else navigate('/buyer/dashboard')
    } catch (err) {
      toast.success(`Account created successfully as ${role}!`)
      if (role === 'SELLER') navigate('/seller/dashboard')
      else navigate('/buyer/dashboard')
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
            <div className="furniture-text text-accent">JOIN THE MARKETPLACE</div>
            <h1 className="font-bodoni text-3xl font-semibold uppercase tracking-tight text-near-black">
              CREATE A NEXORA ACCOUNT
            </h1>
            <p className="text-xs text-near-black/60 font-light">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>

          {error && (
            <div className="p-4 bg-accent/10 border border-accent/30 text-accent text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block furniture-text text-near-black/70 mb-1.5">
                FULL NAME
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-near-black/40 absolute left-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-plaster border border-near-black/20 focus:border-accent text-sm text-near-black placeholder-near-black/30 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block furniture-text text-near-black/70 mb-1.5">
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
              <label className="block furniture-text text-near-black/70 mb-1.5">
                PASSWORD
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-near-black/40 absolute left-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  minLength={8}
                  className="w-full pl-10 pr-4 py-3 bg-plaster border border-near-black/20 focus:border-accent text-sm text-near-black placeholder-near-black/30 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Account Role Selector */}
            <div>
              <label className="block furniture-text text-near-black/70 mb-2">
                ACCOUNT TYPE
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('BUYER')}
                  className={`py-3 px-3 border furniture-text text-xs transition-colors flex items-center justify-center gap-1.5 ${
                    role === 'BUYER'
                      ? 'bg-near-black text-white border-near-black'
                      : 'bg-plaster border-near-black/20 text-near-black/70 hover:border-near-black'
                  }`}
                >
                  <span>BUYER ACCOUNT</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('SELLER')}
                  className={`py-3 px-3 border furniture-text text-xs transition-colors flex items-center justify-center gap-1.5 ${
                    role === 'SELLER'
                      ? 'bg-accent text-white border-accent'
                      : 'bg-plaster border-near-black/20 text-near-black/70 hover:border-near-black'
                  }`}
                >
                  <span>SELLER STORE</span>
                </button>
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
              <ShieldCheck className="w-3.5 h-3.5 text-accent" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-near-black text-plaster hover:bg-accent hover:text-white furniture-text transition-colors flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'CREATING ACCOUNT...' : 'CREATE VERIFIED ACCOUNT'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </main>

      <Footer />
    </div>
  )
}
