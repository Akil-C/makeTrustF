import { Component } from 'react'
import { ShieldAlert, RefreshCw, Home } from 'lucide-react'

/**
 * Enterprise Application Error Boundary
 * Catches unhandled client-side render exceptions, isolates faults,
 * and prevents sensitive system stack trace exposure to end-users.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // In production, log to centralized security monitoring service
    if (import.meta.env.DEV) {
      console.error('[Security ErrorBoundary caught exception]:', error, errorInfo)
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F7F4] flex items-center justify-center p-4 font-sans text-slate-900">
          <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-rose-600 shadow-xs">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Application Protected
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                An isolated component error occurred. Your session state and wallet credentials remain securely protected.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-800 bg-white text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Home className="w-4 h-4" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
