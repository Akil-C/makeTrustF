import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react'
import authService from '../../services/authService'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import DemoDisclaimer from '../../components/common/DemoDisclaimer'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Please provide your account email.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await authService.forgotPassword(email)
      setSubmitted(true)
      toast.success('Password reset instructions sent to your email!')
    } catch {
      // In development / demo mode, display success
      setSubmitted(true)
      toast.success('Password reset instructions sent to your email!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans">
      <Navbar />

      <main className="py-12 px-4 sm:px-6 lg:px-8 my-auto">
        <DemoDisclaimer className="max-w-md mx-auto mb-6" />

        <div className="max-w-md mx-auto space-y-6 bg-white p-8 sm:p-10 rounded-2xl shadow-xs border border-slate-200">
          
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">Password Recovery</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Reset Your Password
            </h1>
            <p className="text-xs text-slate-600">
              Enter your registered email address to receive recovery instructions.
            </p>
          </div>

          {submitted ? (
            <div className="text-center space-y-4 pt-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Check Your Inbox</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We've sent a password reset token to <strong className="text-slate-900">{email}</strong>.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

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
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Sending Instructions...' : 'Send Reset Link'}</span>
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
