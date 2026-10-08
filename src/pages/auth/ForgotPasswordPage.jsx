import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react'
import authService from '../../services/authService'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email) {
      setError('Please provide your email address.')
      return
    }

    setLoading(true)
    try {
      await authService.forgotPassword(email)
      setSubmitted(true)
      toast.success('Password reset email sent!')
    } catch {
      setSubmitted(true)
      toast.success('Password reset link sent to your email!')
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
          
          <div className="text-center space-y-2">
            <div className="furniture-text text-accent">PASSWORD RECOVERY</div>
            <h1 className="font-bodoni text-3xl font-semibold uppercase tracking-tight text-near-black">
              RESET YOUR PASSWORD
            </h1>
            <p className="text-xs text-near-black/60 font-light">
              Enter your registered email address to receive recovery instructions.
            </p>
          </div>

          {submitted ? (
            <div className="text-center space-y-4 pt-4">
              <div className="w-12 h-12 bg-accent/10 text-accent hairline-all flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bodoni text-xl font-bold uppercase text-near-black">CHECK YOUR INBOX</h3>
              <p className="text-xs text-near-black/70 font-light leading-relaxed">
                We've sent a password reset link to <span className="font-bold text-accent">{email}</span>.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 mt-4 px-6 py-3 bg-near-black text-plaster hover:bg-accent furniture-text text-xs transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> RETURN TO SIGN IN
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-accent/10 border border-accent/30 text-accent text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-near-black text-plaster hover:bg-accent hover:text-white furniture-text transition-colors flex items-center justify-center gap-2"
              >
                <span>{loading ? 'SENDING LINK...' : 'SEND RESET LINK'}</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
